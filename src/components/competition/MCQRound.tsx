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
  const [roundDuration, setRoundDuration] = useState(20 * 60); // Default 20 mins

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

  // 0. Fetch Questions (Randomized & Persisted) & Timer Config
  useEffect(() => {
    const initRound = async () => {
      // 1. Fetch Timer Config
      try {
        const { data: config } = await supabase
          .from('game_config')
          .select('value')
          .eq('key', 'mcq_duration')
          .single();
        
        if (config?.value) {
          setRoundDuration(parseInt(config.value) * 60);
        }
      } catch (e) {
        console.warn("Could not load timer config, using default.");
      }

      // 2. Fetch User & Questions
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id || userId;

      if (!currentUserId) return;

      try {
        setLoadingQuestions(true);

        // A. Check for existing assigned questions in DB
        const { data: existingSub } = await supabase
          .from('mcq_submissions')
          .select('question_set, answers') 
          .eq('user_id', currentUserId)
          .maybeSingle();

        let assignedIds: string[] = [];

        if (existingSub && existingSub.question_set && existingSub.question_set.length > 0) {
          // Case 1: Returning User -> Load previously assigned questions
          console.log("Restoring assigned MCQ set...");
          assignedIds = existingSub.question_set;
          
          // Restore previous answers if they exist
          if (existingSub.answers) {
             setAnswers(existingSub.answers);
          }

        } else {
          // Case 2: New User -> Generate Random Set of 10
          console.log("Generating new MCQ set...");
          
          // Fetch ALL MCQ IDs available in the system
          const { data: allQuestions } = await supabase
            .from('questions')
            .select('id')
            .eq('round_id', 'mcq');

          if (!allQuestions || allQuestions.length === 0) {
            toast.error('No MCQ questions found in database.');
            setLoadingQuestions(false);
            return;
          }

          // Shuffle and Pick 10
          const shuffled = allQuestions.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 10);
          assignedIds = selected.map(q => q.id);

          // SAVE THIS SET TO DB IMMEDIATELY (Persistence)
          await supabase.from('mcq_submissions').upsert({
            user_id: currentUserId,
            question_set: assignedIds, // This locks these 10 questions for this user
            score: 0, 
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        }

        // B. Fetch Full Question Details for the assigned IDs
        if (assignedIds.length > 0) {
          const { data: fullQuestions, error } = await supabase
            .from('questions')
            .select('*')
            .in('id', assignedIds);

          if (error) throw error;

          if (fullQuestions) {
            // Parse options if they are stored as JSON strings
            const parsedData = fullQuestions.map((q: any) => {
              let parsedOptions = q.options;
              if (typeof q.options === 'string') {
                try { parsedOptions = JSON.parse(q.options); } catch (e) { parsedOptions = []; }
              }
              return { ...q, options: parsedOptions };
            });
            
            // Optional: Sort questions to ensure consistent order (e.g. by ID or shuffled order)
            // Here we map them back to the order of assignedIds to maintain the shuffled order
            const orderedQuestions = assignedIds
                .map(id => parsedData.find(q => q.id === id))
                .filter(q => q !== undefined) as Question[];

            setQuestions(orderedQuestions);
          }
        }

      } catch (err) {
        console.error('Failed to fetch questions:', err);
        toast.error('Failed to load questions. Please refresh.');
      } finally {
        setLoadingQuestions(false);
      }
    };

    initRound();
  }, [userId]);

  // 1. Start timer on mount (if not already started)
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
      // Note: 'correct_answer' in DB is the string value (e.g., "5 hours")
      // We need to find which index that corresponds to in q.options
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
      // IMPORTANT: We use UPDATE to preserve the 'question_set' we saved earlier
      const { error: updateError } = await supabase
          .from('mcq_submissions')
          .update({
              score: score,
              answers: answers, 
              updated_at: timestamp
          })
          .eq('user_id', authUserId);

      // Fallback: If record somehow missing, insert it (but try to preserve current Qs if we have them)
      if (updateError) {
          console.error("Update failed, trying upsert", updateError);
          const assignedIds = questions.map(q => q.id); // Grab current question IDs
          await supabase.from('mcq_submissions').upsert({
             user_id: authUserId,
             question_set: assignedIds,
             score: score,
             answers: answers,
             updated_at: timestamp
          }, { onConflict: 'user_id' });
      }

      console.log(" MCQ Submission Successful");

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
      toast.error(`Submission Issue: ${err.message || "Please contact admin"}`);
    }

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

  if (loadingQuestions) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-zinc-400">Allocating your unique question set...</p>
        </div>
      </div>
    );
  }

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
        {/* Dynamic Timer */}
        <CompetitionTimer
          totalSeconds={roundDuration}
          onTimeUp={handleTimeUp}
        />

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