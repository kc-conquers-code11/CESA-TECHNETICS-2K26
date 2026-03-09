import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flag, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useCompetitionStore } from '../../store/competitionStore';
import { CompetitionTimer } from './CompetitionTimer';
import { RoundTransition } from './RoundTransition';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';

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
      <div className="h-full flex items-center justify-center font-inter">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mx-auto mb-4" />
          <p className="text-[#008080] font-wizard tracking-widest animate-pulse">Consulting the Oracle...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center font-inter">
        <div className="text-center p-8 border border-dashed border-[#008080]/30 rounded-2xl bg-[#0a1f20]/50 shadow-[0_0_20px_rgba(0,128,128,0.1)]">
          <AlertTriangle className="w-12 h-12 text-[#d4af37] mx-auto mb-4 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
          <h3 className="text-xl font-wizard font-bold text-[#00ffff] mb-2 tracking-wider">Empty Grimoire</h3>
          <p className="text-[#008080] font-manrope">The incantations have not been inscribed yet.</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const isCurrentAnswered = answers[currentQuestion.id]?.length > 0;
  const isCurrentFlagged = flagged.has(currentQuestion.id);

  return (
    <div className="grid lg:grid-cols-[1fr,300px] gap-6 h-full animate-in fade-in slide-in-from-bottom-4 font-inter">
      {/* Main Content */}
      <div className="space-y-6">

        {/* Question Card */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-[#0a1f20]/80 border border-[#008080]/30 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_20px_rgba(0,128,128,0.1)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#008080]/20 text-[#00ffff] font-wizard tracking-widest text-sm border border-[#008080]/50 shadow-[0_0_10px_rgba(0,128,128,0.2)]">
                TRIAL {currentIndex + 1}/{questions.length}
              </span>
              {currentQuestion.multiCorrect && (
                <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[10px] uppercase font-bold tracking-wider border border-[#d4af37]/30">
                  Multiple Paths
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleFlag}
              className={cn(
                "gap-2 text-[#008080] hover:text-[#d4af37] hover:bg-[#d4af37]/10",
                isCurrentFlagged && "text-[#d4af37] bg-[#d4af37]/20 shadow-[0_0_10px_rgba(212,175,55,0.2)] border border-[#d4af37]/30"
              )}
            >
              <Flag className={cn("w-4 h-4 transition-colors", isCurrentFlagged && "fill-[#d4af37]")} />
              {isCurrentFlagged ? 'Marked' : 'Mark'}
            </Button>
          </div>

          {/* Question Text */}
          <h2 className="text-xl font-medium mb-3 leading-relaxed select-none text-white drop-shadow-sm font-manrope">
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
                    "w-full p-4 rounded-xl border-2 text-left transition-all duration-300 flex items-center gap-4 select-none group relative overflow-hidden",
                    isSelected
                      ? "border-[#00ffff] bg-[#008080]/20 shadow-[0_0_15px_rgba(0,255,255,0.15)]"
                      : "border-[#008080]/30 hover:border-[#00ffff]/50 hover:bg-[#021516]/80 bg-[#010a0a]"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 z-10",
                    isSelected ? "border-[#00ffff] bg-[#00ffff]" : "border-[#008080] group-hover:border-[#00ffff]/70"
                  )}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#021516]" />}
                  </div>
                  <span className={cn(
                    "font-medium text-[#e0e0e0] group-hover:text-white transition-colors z-10 font-manrope",
                    isSelected && "text-white font-bold drop-shadow-md"
                  )}>
                    {option}
                  </span>
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00ffff]/5 to-transparent z-0 pointer-events-none" />
                  )}
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
            className="gap-2 border-[#008080]/50 text-[#008080] hover:bg-[#008080]/10 hover:text-[#00ffff] bg-[#0a1f20] h-12 px-6 rounded-xl font-bold tracking-wider uppercase text-xs transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Rewind
          </Button>

          <div className="flex gap-2">
            {currentIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#008080] hover:bg-[#00ffff] text-[#021516] gap-2 h-12 px-8 rounded-xl font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(0,128,128,0.5)] hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all"
              >
                <Loader2 className={cn("w-4 h-4 animate-spin", !isSubmitting && "hidden")} />
                <CheckCircle2 className={cn("w-4 h-4", isSubmitting && "hidden")} />
                {isSubmitting ? 'Inscribing...' : 'Seal Fate'}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                className="gap-2 bg-white hover:bg-[#e0e0e0] text-[#021516] h-12 px-6 rounded-xl font-bold tracking-wider uppercase text-xs transition-all shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              >
                Advance
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Dynamic Timer */}
        <div className="bg-[#0a1f20]/80 border border-[#008080]/30 rounded-2xl p-4 backdrop-blur-md shadow-[0_0_15px_rgba(0,128,128,0.1)]">
          <CompetitionTimer
            totalSeconds={roundDuration}
            onTimeUp={handleTimeUp}
          />
        </div>

        <div className="bg-[#0a1f20]/80 border border-[#008080]/30 rounded-2xl p-5 backdrop-blur-md shadow-[0_0_15px_rgba(0,128,128,0.1)]">
          <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-[#008080]">Ritual Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-wizard text-[#e0e0e0] tracking-wider">
              <span>Resolved</span>
              <span className="font-bold text-[#00ffff] drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">{answeredCount}/{questions.length}</span>
            </div>
            <div className="h-1.5 bg-[#010a0a] rounded-full overflow-hidden border border-[#008080]/20">
              <div
                className="h-full bg-gradient-to-r from-[#008080] to-[#00ffff] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#0a1f20]/80 border border-[#008080]/30 rounded-2xl p-5 backdrop-blur-md shadow-[0_0_15px_rgba(0,128,128,0.1)]">
          <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-[#008080]">Constellation Map</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, index) => {
              const isAnswered = answers[q.id]?.length > 0;
              const isFlagged = flagged.has(q.id);
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-full aspect-square rounded-lg font-bold text-xs transition-all duration-300 relative font-mono",
                    isCurrent && !isAnswered && "ring-2 ring-[#00ffff] bg-[#00ffff]/10 text-[#00ffff] shadow-[0_0_10px_rgba(0,255,255,0.3)]",
                    isAnswered && !isCurrent && "bg-[#008080]/30 text-[#00ffff] border border-[#008080]/50 shadow-[inset_0_0_8px_rgba(0,128,128,0.5)]",
                    !isAnswered && !isCurrent && "bg-[#010a0a] text-[#008080] border border-[#008080]/20 hover:border-[#00ffff]/50 hover:text-[#e0e0e0]",
                    isCurrent && isAnswered && "bg-[#00ffff] text-[#021516] shadow-[0_0_12px_rgba(0,255,255,0.6)]"
                  )}
                >
                  {index + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#d4af37] rounded-full shadow-[0_0_5px_rgba(212,175,55,0.8)] border border-[#021516]" />
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