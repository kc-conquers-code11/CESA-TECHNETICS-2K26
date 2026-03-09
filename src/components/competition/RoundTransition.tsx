import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useCompetitionStore } from '../../store/competitionStore';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface RoundTransitionProps {
  completedRound: string;
  nextRoundName: string;
  nextRoundSlug: 'flowchart' | 'coding' | 'completed';
}

export const RoundTransition = ({ completedRound, nextRoundName, nextRoundSlug }: RoundTransitionProps) => {
  const { userId, syncSession } = useCompetitionStore();
  const [checking, setChecking] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  // Check if the next round has already been started by admin
  const checkNextRoundStatus = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('exam_sessions')
        .select('current_round_slug')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error checking round status:', error);
        return;
      }

      if (data && data.current_round_slug === nextRoundSlug) {
        // The admin has already started the next round!
        console.log(`✅ Admin has started ${nextRoundName}! Navigating...`);
        toast.success(`${nextRoundName} has started! Entering now...`);

        // Fetch full session data and sync
        const { data: fullSession } = await supabase
          .from('exam_sessions')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (fullSession) {
          syncSession(fullSession);
        }
      }
    } catch (err) {
      console.error('Failed to check round status:', err);
    }
  };

  // Initial check on mount
  useEffect(() => {
    checkNextRoundStatus();
  }, []);

  // Polling mechanism - check every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPollCount(prev => prev + 1);
      checkNextRoundStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [userId, nextRoundSlug, syncSession]);

  // Realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`round-transition-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'exam_sessions',
          filter: `user_id=eq.${userId}`
        },
        (payload: any) => {
          console.log("⚡ Realtime Update during transition:", payload.new);
          if (payload.new.current_round_slug === nextRoundSlug) {
            toast.success(`${nextRoundName} has started! Entering now...`);
            syncSession(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, nextRoundSlug, syncSession, nextRoundName]);

  // Manual refresh button
  const handleManualRefresh = async () => {
    setChecking(true);
    await checkNextRoundStatus();
    setTimeout(() => setChecking(false), 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 p-4 relative overflow-hidden font-inter">

      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00ffff]/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />

      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 w-32 h-32 bg-[#021516]/80 rounded-full flex items-center justify-center border-2 border-[#00ffff]/30 shadow-[0_0_40px_rgba(0,255,255,0.2)]"
      >
        <div className="absolute inset-0 rounded-full border border-[#008080]/50 animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border border-dashed border-[#d4af37]/30 animate-[spin_6s_linear_infinite_reverse]" />
        <CheckCircle2 className="w-16 h-16 text-[#00ffff] drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
      </motion.div>

      {/* Main Message */}
      <div className="space-y-4 max-w-lg relative z-10">
        <h2 className="text-4xl font-wizard font-bold text-[#d4af37] tracking-wider drop-shadow-md">
          {completedRound} Conquered!
        </h2>
        <p className="text-[#008080] font-medium font-manrope">
          Excellent work, spellcaster. Your magic has been etched into the Grand Tome.
        </p>

        {/* Waiting Status */}
        <div className="bg-[#0a1f20]/90 border border-[#008080]/40 p-6 rounded-2xl flex items-center gap-5 text-left backdrop-blur-md shadow-[0_0_25px_rgba(0,128,128,0.15)] mt-8">
          <div className="p-4 bg-[#021516] rounded-xl border border-[#008080]/30 shadow-inner">
            <Clock className="w-8 h-8 text-[#d4af37] animate-pulse" />
          </div>
          <div>
            <p className="text-[#00ffff] font-bold text-sm tracking-widest uppercase mb-1">
              AWAITING {nextRoundName.toUpperCase()}
            </p>
            <p className="text-[#008080] text-sm font-manrope leading-tight">
              The portal to the next phase will open once the High Mage (Admin) performs the invocation.
            </p>
          </div>
        </div>
      </div>

      {/* Status & Controls */}
      <div className="space-y-6 relative z-10 pt-4">
        <div className="flex items-center justify-center gap-3 text-[#008080] text-sm font-mono font-bold tracking-widest uppercase">
          <Loader2 className="w-5 h-5 animate-spin text-[#d4af37]" />
          <span className="animate-pulse">
            Scrying for {nextRoundName} portal... ({pollCount * 3}s)
          </span>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={handleManualRefresh}
          disabled={checking}
          className="group flex items-center gap-2 px-6 py-3 mx-auto bg-[#021516] hover:bg-[#008080] border border-[#008080] rounded-xl transition-all text-xs font-bold text-[#00ffff] hover:text-[#021516] uppercase tracking-widest disabled:opacity-50 disabled:hover:bg-[#021516] disabled:hover:text-[#00ffff] shadow-[0_0_10px_rgba(0,128,128,0.2)] hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
        >
          <RefreshCw className={cn("w-4 h-4 transition-transform group-hover:rotate-180", checking && "animate-spin")} />
          {checking ? "Consulting..." : "Force Vision Update"}
        </button>

        <p className="text-xs text-[#008080]/70 mt-6 font-manrope italic">
          Tip: Do not break the circle (close this tab). You will be drawn into {nextRoundName} automatically.
        </p>
      </div>
    </div>
  );
};
