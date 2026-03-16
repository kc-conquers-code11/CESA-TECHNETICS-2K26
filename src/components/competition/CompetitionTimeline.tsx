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
  const { roundStatus, currentRound, activeCompetition } = useCompetitionStore();
  
  let currentSteps: TimelineStep[] = [];
  
  if (activeCompetition === 'darkmark') {
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
      }
    ];
  } else {
    // Default to Obscure Code steps
    currentSteps = [...steps];
  }

  return (
    <div className="bg-[#1a0f08]/95 backdrop-blur-md border border-[#8b6e2e]/30 rounded-xl p-5 h-fit w-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b6e2e]/40 to-transparent" />
      
      <h2 className="font-inter text-lg font-bold text-[#d4af37] tracking-[0.2em] mb-6 uppercase border-b border-[#8b6e2e]/20 pb-2">
        {activeCompetition === 'darkmark' ? "Extraction Progress" : "Magical Progress"}
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
            <div key={step.id} className="flex gap-4">
              
              {/* LEFT COLUMN: Icon + Line (Fixed Alignment) */}
              <div className="flex flex-col items-center">
                {/* Icon Bubble */}
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300 shrink-0",
                    isActive && "border-[#d4af37] bg-[#3d2618] text-[#f2e0b5] shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-pulse",
                    isCompleted && "border-[#8b6e2e] bg-[#1a0f08] text-[#d4af37]",
                    isLocked && "border-[#3d2618] bg-[#0d0805] text-[#3d2618]"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : 
                   isLocked ? <Lock className="w-4 h-4" /> : 
                   step.icon}
                </div>

                {/* Connector Line (Auto-expands to connect next step) */}
                {!isLast && (
                  <div 
                    className={cn(
                      "w-0.5 flex-1 my-1 transition-colors duration-500 min-h-[2rem]",
                      isCompleted ? "bg-[#8b6e2e]" : "bg-[#3d2618]"
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
                className={cn("flex-1 pb-8 pt-0.5", isLast && "pb-0")} 
              >
                <div 
                  className={cn(
                    "p-3 rounded-lg transition-all duration-300 border",
                    // Active Highlights
                    isActive && "bg-[#3d2618]/40 border-[#d4af37]/30 shadow-[0_0_20px_rgba(212,175,55,0.05)]",
                    isCompleted && "bg-[#1a0f08]/50 border-[#8b6e2e]/10",
                    isLocked && "opacity-40 border-transparent"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={cn(
                        "font-harry text-sm tracking-widest transition-colors pt-0.5",
                        isActive && "text-[#f2e0b5]",
                        isCompleted && "text-[#d4af37]",
                        isLocked && "text-[#3d2618]"
                      )}
                    >
                      {step.title}
                    </h3>
                    
                    {/* Compact Status Badge */}
                    <span
                      className={cn(
                        "text-[8px] px-2 py-0.5 rounded-full uppercase tracking-[0.2em] font-sans font-bold border",
                        isActive && "bg-[#d4af37]/20 text-[#f2e0b5] border-[#d4af37]/30",
                        isCompleted && "bg-[#8b6e2e]/20 text-[#d4af37] border-[#8b6e2e]/30",
                        isLocked && "bg-transparent text-[#3d2618] border-[#3d2618]/30"
                      )}
                    >
                      {isActive ? 'Active' : isCompleted ? 'Accepted' : 'Sealed'}
                    </span>
                  </div>
                  
                  <p className={cn(
                    "text-[10px] leading-tight font-crimson italic tracking-wide",
                    isActive ? "text-[#f2e0b5]/70" : "text-[#f2e0b5]/40"
                  )}>
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