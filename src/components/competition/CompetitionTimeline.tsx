import { motion } from 'framer-motion';
import { Check, Lock, Play, FileText, GitBranch, Code } from 'lucide-react';
import { useCompetitionStore, Round, RoundStatus } from '@/store/competitionStore';
import { cn } from '@/lib/utils';

interface TimelineStep {
  id: Round;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: TimelineStep[] = [
  {
    id: 'rules',
    title: 'Competition Rules',
    description: 'Read and accept the rules',
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: 'mcq',
    title: 'Round 1: Aptitude',
    description: 'Multiple choice questions',
    icon: <Check className="w-4 h-4" />,
  },
  {
    id: 'flowchart',
    title: 'Round 2: GitHub Sync',
    description: 'Clone and fix the cursed repo',
    icon: <GitBranch className="w-4 h-4" />,
  },
  {
    id: 'coding',
    title: 'Round 3: Quest Selection',
    description: 'Choose your final hackathon quest',
    icon: <Code className="w-4 h-4" />,
  },
];

const getStatusIcon = (status: RoundStatus) => {
  switch (status) {
    case 'completed':
      return <Check className="w-3.5 h-3.5" />;
    case 'locked':
      return <Lock className="w-3.5 h-3.5" />;
    case 'active':
      return <Play className="w-3.5 h-3.5" />;
  }
};

export const CompetitionTimeline = () => {
  const { roundStatus, currentRound, isDarkMark } = useCompetitionStore();
  let currentSteps = [...steps];
  if (isDarkMark) {
    currentSteps = [
      {
    id: 'rules',
    title: 'Competition Rules',
    description: 'Read and accept the rules',
    icon: <FileText className="w-4 h-4" />,
  },
  {
      id: 'darkmark',
      title: 'Bonus: Dark Mark Bounty',
      description: 'The ultimate extraction challenge',
      icon: <Check className="w-4 h-4 text-red-500" />,
    }];
  }

  return (
    <div className="glass-strong rounded-xl p-5 h-fit w-full">
      <h2 className="font-display text-base font-bold gradient-text mb-4">
        {isDarkMark ? "Extraction Progress" : "Competition Progress"}
      </h2>
      
      <div className="flex flex-col">
        {currentSteps.map((step, index) => {
          const status = roundStatus[step.id];
          const isActive = currentRound === step.id;
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';
          const isLast = index === currentSteps.length - 1;
          
          return (
            // Flex row ensures Icon and Content stay aligned side-by-side
            <div key={step.id} className="flex gap-3">
              
              {/* LEFT COLUMN: Icon + Line (Fixed Alignment) */}
              <div className="flex flex-col items-center">
                {/* Icon Bubble */}
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shrink-0",
                    isActive && "border-primary bg-primary/20 text-primary animate-pulse-glow",
                    isCompleted && "border-success bg-success/20 text-success",
                    isLocked && "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? getStatusIcon('completed') : step.icon}
                </div>

                {/* Connector Line (Auto-expands to connect next step) */}
                {!isLast && (
                  <div 
                    className={cn(
                      "w-0.5 flex-1 my-0.5 transition-colors duration-500 min-h-[1.5rem]",
                      isCompleted ? "bg-primary" : "bg-border"
                    )} 
                  />
                )}
              </div>
              
              {/* RIGHT COLUMN: Content */}
              {/* Padding bottom ensures gap for the next item's line */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn("flex-1 pb-6 pt-0.5", isLast && "pb-0")} 
              >
                <div 
                  className={cn(
                    "p-2.5 rounded-lg transition-all duration-300 border border-transparent",
                    // Active Highlights
                    isActive && "bg-primary/10 glow-primary border-primary/20",
                    isCompleted && "bg-success/5 border-success/10",
                    isLocked && "opacity-60"
                  )}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <h3
                      className={cn(
                        "font-semibold text-xs transition-colors",
                        isActive && "text-primary text-glow-primary",
                        isCompleted && "text-success",
                        isLocked && "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </h3>
                    
                    {/* Compact Status Badge */}
                    <span
                      className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold",
                        isActive && "bg-primary/20 text-primary border border-primary/20",
                        isCompleted && "bg-success/20 text-success border border-success/20",
                        isLocked && "bg-muted text-muted-foreground border border-border"
                      )}
                    >
                      {isActive ? 'Active' : isCompleted ? 'Done' : 'Locked'}
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};