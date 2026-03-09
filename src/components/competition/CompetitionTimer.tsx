import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Shield } from 'lucide-react';
import { useCompetitionStore } from '../../store/competitionStore';
import { cn } from '../../lib/utils';

interface CompetitionTimerProps {
  totalSeconds: number;
  targetDate?: string | null;
  onTimeUp?: () => void;
  isActive?: boolean;
  className?: string;
}

export const CompetitionTimer = ({
  totalSeconds,
  targetDate,
  onTimeUp,
  isActive = true,
  className,
}: CompetitionTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const { tabSwitchCount, currentRound } = useCompetitionStore();

  // Sync state with targetDate when it becomes available
  useEffect(() => {
    if (targetDate) {
      const msRemaining = new Date(targetDate).getTime() - new Date().getTime();
      const secondsRemaining = Math.max(0, Math.floor(msRemaining / 1000));
      setTimeRemaining(secondsRemaining);
    } else {
      setTimeRemaining(totalSeconds);
    }
  }, [targetDate, totalSeconds]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        // If we have a target date, recalculate to avoid drift
        if (targetDate) {
          const msRemaining = new Date(targetDate).getTime() - new Date().getTime();
          const seconds = Math.floor(msRemaining / 1000);

          if (seconds <= 0) {
            if (prev > 0) onTimeUp?.();
            return 0;
          }
          return seconds;
        }

        // Fallback to simple countdown
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp, targetDate]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = (timeRemaining / totalSeconds) * 100;
  const isLow = timeRemaining < 300; // Less than 5 minutes
  const isCritical = timeRemaining < 60; // Less than 1 minute

  return (
    <div className={cn("space-y-4 font-inter", className)}>
      {/* Timer Display - Compact horizontal layout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#008080] text-xs font-bold uppercase tracking-widest">
          <Clock className="w-5 h-5 text-[#d4af37]" />
          <span>Sands of Time</span>
        </div>

        <motion.div
          className={cn(
            "font-wizard text-3xl font-bold tracking-widest drop-shadow-[0_0_5px_currentColor]",
            isCritical && "text-red-500 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]",
            isLow && !isCritical && "text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]",
            !isLow && "text-[#00ffff] drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]"
          )}
          animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </motion.div>
      </div>

      {/* Progress bar - More prominent */}
      <div className="h-1 bg-[#010a0a] rounded-full overflow-hidden border border-[#008080]/30 shadow-inner">
        <motion.div
          className={cn(
            "h-full rounded-full transition-colors duration-300 shadow-[0_0_10px_currentColor]",
            isCritical ? "bg-red-500" : isLow ? "bg-[#d4af37]" : "bg-gradient-to-r from-[#008080] via-[#00ffff] to-[#008080] bg-[length:200%_auto] animate-gradient"
          )}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Status indicators - Compact inline display */}
      <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-widest font-mono">
        {/* Current Round */}
        <div className="flex items-center justify-between bg-[#021516]/80 px-3 py-2 rounded border border-[#008080]/30 shadow-[0_0_10px_rgba(0,128,128,0.1)]">
          <span className="text-[#008080]">Current Phase:</span>
          <span className="text-[#d4af37] drop-shadow-sm font-wizard text-sm">
            {currentRound === 'mcq' ? 'Ordeals (MCQ)' :
              currentRound === 'flowchart' ? 'Logic Arrays' :
                currentRound === 'coding' ? 'Spellcrafting' : currentRound}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          {/* Tab Switch Warning */}
          {tabSwitchCount > 0 ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 bg-red-950/40 text-red-400 border border-red-900/60 px-2 py-1.5 rounded shadow-[0_0_10px_rgba(220,38,38,0.2)]"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Infractions: {tabSwitchCount}/3</span>
            </motion.div>
          ) : <div />}

          {/* Security Status */}
          <div className="flex items-center gap-1.5 bg-[#008080]/10 text-[#00ffff] border border-[#008080]/30 px-2 py-1.5 rounded shadow-[0_0_8px_rgba(0,128,128,0.2)]">
            <Shield className="w-3 h-3" />
            <span>Eye Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
