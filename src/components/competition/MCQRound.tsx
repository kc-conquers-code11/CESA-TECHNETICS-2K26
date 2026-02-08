import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flag, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompetitionStore } from '@/store/competitionStore';
import { CompetitionTimer } from './CompetitionTimer';
import { RoundTransition } from './RoundTransition';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

interface Question {
  id: string;
  title: string;
  description: string;
  options: string[];
  correct_answer: string;
  points?: number;
  multiCorrect?: boolean;
}

export const MCQRound = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Store hooks
  const {
    completeRound,
    incrementTabSwitch,
    startMCQ,
    mcqStartTime,
    userId,
    email
  } = useCompetitionStore();

  const currentQuestion = questions[currentIndex];

  // 0. Fetch and Randomize Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      // Ensure we have a user ID before fetching to avoid key issues
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id || userId;

      if (!currentUserId) return;

      try {
        // Fetch ALL questions for the round
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('round_id', 'mcq');

        if (error) throw error;

        if (data && data.length > 0) {
          // 1. Parse Options (Handle JSON string or Array)
          const parsedData = data.map((q: any) => {
            let parsedOptions = q.options;
            if (typeof q.options === 'string') {
              try {
                parsedOptions = JSON.parse(q.options);
              } catch (e) {
                console.error("Failed to parse options for question", q.id, e);
                parsedOptions = [];
              }
            }
            return { ...q, options: parsedOptions };
          });

          // 2. Random Selection Logic (10 Questions) with Persistence
          const STORAGE_KEY = `mcq_assigned_${currentUserId}`;
          const stored = localStorage.getItem(STORAGE_KEY);
          
          let selectedQuestions: Question[] = [];

          if (stored) {
             try {
                 const storedIds = JSON.parse(stored);
                 // Restore questions based on stored IDs to maintain order/selection on refresh
                 selectedQuestions = storedIds
                    .map((id: string) => parsedData.find((q: any) => q.id === id))
                    .filter(Boolean); // Remove undefined if a question was deleted from DB
             } catch (e) {
                 console.error("Error parsing stored questions", e);
             }
          }

          // If no valid stored session, generate new random set
          if (selectedQuestions.length === 0) {
             // Fisher-Yates Shuffle
             const shuffled = [...parsedData];
             for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
             }
             // Slice first 10
             selectedQuestions = shuffled.slice(0, 10);
             
             // Save to local storage
             localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedQuestions.map(q => q.id)));
          }

          setQuestions(selectedQuestions);
        } else {
          toast.error('No MCQ questions found in database.');
        }
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        toast.error('Failed to load questions. Please refresh.');
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [userId]);

  // 1. Start timer on mount
  useEffect(() => {
    if (!mcqStartTime) {
      startMCQ();
    }
  }, [mcqStartTime, startMCQ]);

  // 2. Anti-Cheat: Tab Switch Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        incrementTabSwitch();
        toast.warning('Tab switch detected! This has been logged.', {
          icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
          duration: 4000
        });
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Copying is disabled!');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Pasting is disabled!');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [incrementTabSwitch]);

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => {
      const current = prev[currentQuestion.id] || [];

      if (currentQuestion.multiCorrect) {
        if (current.includes(optionIndex)) {
          return { ...prev, [currentQuestion.id]: current.filter(i => i !== optionIndex) };
        }
        return { ...prev, [currentQuestion.id]: [...current, optionIndex] };
      }
      return { ...prev, [currentQuestion.id]: [optionIndex] };
    });
  };

  const handleFlag = () => {
    setFlagged((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return; 
    setIsSubmitting(true);

    // Calculate Score
    let score = 0;
    questions.forEach(q => {
      const userAnswers = answers[q.id] || [];
      const correctOptionIndex = q.options.findIndex(opt => opt === q.correct_answer);
      if (correctOptionIndex !== -1 && userAnswers.includes(correctOptionIndex)) {
        score += (q.points || 10);
      }
    });

    console.log("🚀 Attempting Submission...", { score, userId });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const authUserId = user?.id || userId;

      if (!authUserId) throw new Error("User ID not found.");

      const timestamp = new Date().toISOString();

      // 1. Update Profile
      await supabase.from('profiles').upsert({
          id: authUserId,
          email: email,
          score: score, 
          last_active: timestamp,
          competition_status: 'active'
      }, { onConflict: 'id' });

      // 2. Submit MCQ Data
      // Payload preparation
      const submissionPayload = {
          user_id: authUserId,
          score: score,
          answers: answers, // Supabase client auto-converts this to JSONB
          updated_at: timestamp
      };

      // Try UPSERT first (requires UNIQUE constraint on user_id)
      const { error: upsertError } = await supabase
          .from('mcq_submissions')
          .upsert(submissionPayload, { onConflict: 'user_id' });

      if (upsertError) {
          console.error("⚠️ Upsert Failed (likely missing unique constraint). Trying INSERT...", upsertError.message);
          
          // Fallback: Try simple INSERT if upsert failed
          // Note: This might duplicate data if run twice, but it saves the exam.
          const { error: insertError } = await supabase
            .from('mcq_submissions')
            .insert([submissionPayload]);
            
          if (insertError) {
             throw insertError; // Throw real error if both fail
          }
      }

      console.log("✅ MCQ Submission Successful");

      // 3. Update Leaderboard
      const { data: existing } = await supabase.from('leaderboard').select('*').eq('user_id', authUserId).maybeSingle();
      const r2 = existing?.round2_score || 0;
      const r3 = existing?.round3_score || 0;
      
      await supabase.from('leaderboard').upsert({
        user_id: authUserId,
        round1_score: score,
        overall_score: score + r2 + r3,
        updated_at: timestamp
      }, { onConflict: 'user_id' });

    } catch (err: any) {
      console.error("❌ CRITICAL SUBMISSION ERROR:", err.message || err);
      toast.error(`Submission Issue: ${err.message || "Please take a screenshot and contact admin"}`);
      // We do NOT return here; we allow the transition to happen so the user isn't stuck.
    }

    // Always transition user to next round even if DB glitch occurs (logs are saved in localStorage usually as backup)
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      completeRound('mcq');
    }, 1000);
  }, [answers, questions, userId, completeRound, email, isSubmitting]);

  const handleTimeUp = useCallback(() => {
    toast.error("Time's up! Auto-submitting your answers...");
    handleSubmit();
  }, [handleSubmit]);

  // Show transition screen after submission
  if (submitted) {
    return <RoundTransition
      completedRound="MCQ Round"
      nextRoundName="Flowchart Round"
      nextRoundSlug="flowchart"
    />;
  }

  // Loading State
  if (loadingQuestions) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-zinc-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  // No Questions State
  if (questions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Questions Available</h3>
          <p className="text-zinc-400">Please contact the administrator.</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const isCurrentAnswered = answers[currentQuestion.id]?.length > 0;
  const isCurrentFlagged = flagged.has(currentQuestion.id);

  return (
    <div className="grid lg:grid-cols-[1fr,300px] gap-6 h-full animate-in fade-in slide-in-from-bottom-4">
      {/* Main Content */}
      <div className="space-y-6">

        {/* Question Card */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-red-900/30 text-red-400 font-display font-bold text-sm border border-red-900/50">
                Q{currentIndex + 1}/{questions.length}
              </span>
              {currentQuestion.multiCorrect && (
                <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs border border-blue-900/50">
                  Multi-select
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleFlag}
              className={cn(
                "gap-2 hover:bg-zinc-800",
                isCurrentFlagged && "text-yellow-500 bg-yellow-900/20"
              )}
            >
              <Flag className={cn("w-4 h-4", isCurrentFlagged && "fill-yellow-500")} />
              {isCurrentFlagged ? 'Flagged' : 'Flag'}
            </Button>
          </div>

          {/* Question Text */}
          <h2 className="text-xl font-semibold mb-2 leading-relaxed select-none text-zinc-100">
            {currentQuestion.title}
          </h2>
          {currentQuestion.description && (
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              {currentQuestion.description}
            </p>
          )}

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id]?.includes(index);

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectOption(index)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center gap-4 select-none group",
                    isSelected
                      ? "border-red-600 bg-red-900/20"
                      : "border-zinc-700 hover:border-red-500/50 hover:bg-zinc-800"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                    isSelected ? "border-red-600 bg-red-600" : "border-zinc-600 group-hover:border-zinc-400"
                  )}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <span className={cn(
                    "font-medium text-zinc-300 group-hover:text-white transition-colors",
                    isSelected && "text-white"
                  )}>
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="gap-2 border-zinc-700 hover:bg-zinc-800"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 gap-2 text-white"
              >
                <Loader2 className={cn("w-4 h-4 animate-spin", !isSubmitting && "hidden")} />
                <CheckCircle2 className={cn("w-4 h-4", isSubmitting && "hidden")} />
                {isSubmitting ? 'Submitting...' : 'Submit All'}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                className="gap-2 bg-zinc-100 text-zinc-900 hover:bg-white"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Timer */}
        <CompetitionTimer
          totalSeconds={30 * 60}
          onTimeUp={handleTimeUp}
        />

        {/* Progress Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 backdrop-blur-md">
          <h3 className="text-sm font-semibold mb-3 text-zinc-400">Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Answered</span>
              <span className="font-bold text-red-500">{answeredCount}/{questions.length}</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 backdrop-blur-md">
          <h3 className="text-sm font-semibold mb-3 text-zinc-400">Navigator</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => {
              const isAnswered = answers[q.id]?.length > 0;
              const isFlagged = flagged.has(q.id);
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-8 h-8 rounded-lg font-bold text-xs transition-all duration-200 relative",
                    isCurrent && "ring-2 ring-red-500 bg-red-500/10 text-red-500",
                    isAnswered && !isCurrent && "bg-green-900/30 text-green-400 border border-green-900/50",
                    !isAnswered && !isCurrent && "bg-zinc-800 text-zinc-500 hover:bg-zinc-700",
                    isCurrent && isAnswered && "bg-green-500 text-black ring-green-500"
                  )}
                >
                  {index + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full shadow-lg" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};