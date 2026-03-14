import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabaseClient';

export type RoundStatus = 'locked' | 'active' | 'completed';
//  ADDED: Intermediate waiting rounds (waiting_r2, waiting_r3) to act as barriers
export type Round = 'rules' | 'waiting' | 'mcq' | 'waiting_r2' | 'flowchart' | 'waiting_r3' | 'coding' | 'completed' | 'darkmark';
export type CompetitionStatus = 'active' | 'frozen' | 'disqualified';

interface CompetitionState {
  // State
  competitionStatus: CompetitionStatus;
  currentRound: Round;
  roundStatus: Record<Round, RoundStatus>;
  userId: string | null;
  email: string | null;
  tabSwitchCount: number;
  mcqStartTime: number | null;
  flowchartStartTime: number | null;
  isDarkMark: boolean;
  isObscure: boolean;
  teamName: string | null;
  selectedPSId: number | null;
  // phoneNumber: string | null;

  // Actions
  initializeUser: (userId: string, email: string) => Promise<void>;
  acceptRules: () => Promise<void>;
  syncSession: (data: any) => void;
  startRound1: () => void;
  startMCQ: () => void;
  startFlowchart: () => void;
  startDarkMark: () => void;
  completeRound: (round: Round) => Promise<void>;
  logTabSwitch: () => Promise<void>;
  incrementTabSwitch: () => Promise<void>;
  freezeCompetition: () => Promise<void>;
  unfreezeCompetition: () => void;
  disqualifyUser: () => Promise<void>;
  disqualify: () => Promise<void>;
  setPSId: (id: number) => Promise<void>;
  resetCompetition: () => void;
}

const initialState = {
  competitionStatus: 'active' as CompetitionStatus,
  currentRound: 'rules' as Round,
  roundStatus: {
    rules: 'active',
    waiting: 'locked',
    mcq: 'locked',
    waiting_r2: 'locked',
    flowchart: 'locked',
    waiting_r3: 'locked',
    coding: 'locked',
    completed: 'locked',
    darkmark: 'locked',
  } as Record<Round, RoundStatus>,
  tabSwitchCount: 0,
  mcqStartTime: null,
  flowchartStartTime: null,
  userId: null,
  email: null,
  isDarkMark: false,
  isObscure: false,
  teamName: null,
  selectedPSId: null,
  // phoneNumber: null,
};

// Define the strict linear order of rounds
const ROUND_ORDER: Round[] = ['rules', 'waiting', 'mcq', 'waiting_r2', 'flowchart', 'waiting_r3', 'coding', 'completed'];

export const useCompetitionStore = create<CompetitionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeUser: async (userId, email) => {
        set({ userId, email });
        const { data } = await supabase.from('exam_sessions').select('*').eq('user_id', userId).single();

        if (data) {
          const currentRoundSlug = data.current_round_slug as Round;
          const currentIndex = ROUND_ORDER.indexOf(currentRoundSlug);

          const newRoundStatus = { ...initialState.roundStatus };

          // Mark all rounds before current as completed
          for (let i = 0; i < currentIndex; i++) {
            newRoundStatus[ROUND_ORDER[i]] = 'completed';
          }

          // Mark current round as active
          if (currentIndex !== -1) {
            newRoundStatus[currentRoundSlug] = 'active';
          }

          set({
            competitionStatus: data.status,
            currentRound: currentRoundSlug,
            tabSwitchCount: data.tab_switches || 0,
            roundStatus: newRoundStatus,
            isDarkMark: data.is_dark_mark || false,
            isObscure: data.is_obscure || false,
            teamName: data.team_name || null,
            selectedPSId: data.selected_ps_id || null,
            // phoneNumber: data.phone_number || null,
          });
        } else {
          // Create session if not exists
          await supabase.from('exam_sessions').insert({
            user_id: userId,
            email: email,
            status: 'active',
            current_round_slug: 'rules'
          });
        }
      },

      syncSession: (data) => {
        console.log("⚡ Session Sync:", data);

        const currentRoundSlug = data.current_round_slug as Round;
        const currentIndex = ROUND_ORDER.indexOf(currentRoundSlug);

        const newRoundStatus = { ...initialState.roundStatus };

        // Mark all rounds before current as completed
        for (let i = 0; i < currentIndex; i++) {
          newRoundStatus[ROUND_ORDER[i]] = 'completed';
        }

        // Mark current round as active
        if (currentIndex !== -1) {
          newRoundStatus[currentRoundSlug] = 'active';
        }

        set({
          competitionStatus: data.status,
          currentRound: currentRoundSlug,
          tabSwitchCount: data.tab_switches,
          roundStatus: newRoundStatus,
          isDarkMark: data.is_dark_mark || false,
          isObscure: data.is_obscure || false,
          teamName: data.team_name || null,
          selectedPSId: data.selected_ps_id || null,
          // phoneNumber: data.phone_number || null,
        });
      },

      acceptRules: async () => {
        const { userId } = get();
        // Move to initial Waiting Room
        const nextRound = 'waiting';

        const newRoundStatus = { ...get().roundStatus };
        newRoundStatus.rules = 'completed';
        newRoundStatus.waiting = 'active';

        set({ currentRound: nextRound, roundStatus: newRoundStatus });
        if (userId) await supabase.from('exam_sessions').update({ current_round_slug: nextRound }).eq('user_id', userId);
      },

      startMCQ: () => {
        if (!get().mcqStartTime) set({ mcqStartTime: Date.now() });
      },

      startFlowchart: () => {
        if (!get().flowchartStartTime) set({ flowchartStartTime: Date.now() });
      },

      startRound1: () => {
        // Admin Force Start -> directly sets to MCQ
        const newRoundStatus = { ...get().roundStatus };
        newRoundStatus.rules = 'completed';
        newRoundStatus.waiting = 'completed';
        newRoundStatus.mcq = 'active';

        set({ currentRound: 'mcq', roundStatus: newRoundStatus });
        get().startMCQ();
      },

      startDarkMark: () => {
        const newRoundStatus = { ...get().roundStatus };
        newRoundStatus.darkmark = 'active';
        set({ currentRound: 'darkmark', roundStatus: newRoundStatus });
      },

      completeRound: async (completedRound) => {
        const { userId, roundStatus } = get();
        const newRoundStatus = { ...roundStatus };

        let nextRound: Round = 'completed';

        //  LOGIC CHANGED: Move to Waiting Room instead of next round
        if (completedRound === 'mcq') {
          nextRound = 'waiting_r2'; // Wait for Round 2
          newRoundStatus.mcq = 'completed';
          newRoundStatus.waiting_r2 = 'active';
        }
        else if (completedRound === 'flowchart') {
          nextRound = 'waiting_r3'; // Wait for Round 3
          newRoundStatus.flowchart = 'completed';
          newRoundStatus.waiting_r3 = 'active';
        }
        else if (completedRound === 'coding') {
          nextRound = 'completed'; // Finish
          newRoundStatus.coding = 'completed';
          newRoundStatus.completed = 'active';
        }

        set({ currentRound: nextRound, roundStatus: newRoundStatus });

        // Update DB so Admin sees user is waiting
        if (userId) await supabase.from('exam_sessions').update({ current_round_slug: nextRound }).eq('user_id', userId);
      },

      logTabSwitch: async () => {
        const { tabSwitchCount, userId, competitionStatus } = get();
        if (competitionStatus !== 'active') return;
        const newCount = tabSwitchCount + 1;
        set({ tabSwitchCount: newCount });
        if (newCount >= 2) set({ competitionStatus: 'frozen' });
        if (userId) await supabase.from('exam_sessions').update({ tab_switches: newCount, status: newCount >= 2 ? 'frozen' : 'active' }).eq('user_id', userId);
      },

      incrementTabSwitch: async () => get().logTabSwitch(),

      freezeCompetition: async () => {
        set({ competitionStatus: 'frozen' });
        const { userId } = get();
        if (userId) await supabase.from('exam_sessions').update({ status: 'frozen' }).eq('user_id', userId);
      },

      unfreezeCompetition: () => {
        set({ competitionStatus: 'active' });
      },

      disqualifyUser: async () => {
        set({ competitionStatus: 'disqualified', currentRound: 'completed' });
        const { userId } = get();
        if (userId) await supabase.from('exam_sessions').update({ status: 'disqualified' }).eq('user_id', userId);
      },

      disqualify: async () => get().disqualifyUser(),

      setPSId: async (id) => {
        const { userId } = get();
        set({ selectedPSId: id });
        if (userId) {
          await supabase.from('exam_sessions').update({ selected_ps_id: id }).eq('user_id', userId);
        }
      },

      resetCompetition: () => set(initialState),
    }),
    { name: 'cesa-storage' }
  )
);