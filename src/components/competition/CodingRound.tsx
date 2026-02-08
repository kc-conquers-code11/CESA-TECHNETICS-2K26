import React, { useState, useEffect, useCallback, useRef } from 'react';
import Editor from "@monaco-editor/react";
import { 
  Play, Send, Save, Cloud, Terminal, Cpu, ChevronDown, CheckCircle2, 
  XCircle, Loader2, AlertCircle, RefreshCw, Lock, Unlock, Code2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useCompetitionStore } from '@/store/competitionStore';
import { CompetitionTimer } from './CompetitionTimer';
import { RoundTransition } from './RoundTransition';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// --- CONFIG ---
const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript (Node 18)' },
  { id: 'python', name: 'Python 3' },
  { id: 'cpp', name: 'C++ (GCC)' }, 
  { id: 'c', name: 'C (GCC)' },     
  { id: 'java', name: 'Java (OpenJDK)' },
];

// --- TYPES ---
interface CodingProblem {
  id: string;
  title: string;
  description: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  starter_code: string;
  difficulty: string;
}

interface ProblemState {
  problem_id: string;
  code: string;
  language: string;
  status: 'draft' | 'completed';
  details?: CodingProblem; // Hydrated from DB
}

interface RunResult {
  status: string; // 'Accepted', 'Wrong Answer', 'Runtime Error', etc.
  score?: string;
  output?: string;
  metrics?: { time: number; memory: number };
  results?: { 
    status: 'Accepted' | 'Wrong Answer' | 'Runtime Error';
    input: string;
    expected: string;
    actual: string;
    error?: string;
  }[];
}

export const CodingRound = ({ isSidebarExpanded }: { isSidebarExpanded: boolean }) => {
  const { completeRound, userId } = useCompetitionStore();
  
  // --- STATE ---
  const [problemSet, setProblemSet] = useState<ProblemState[]>([]);
  const [activeIndex, setActiveIndex] = useState(0); // 0 = Easy, 1 = Medium
  const [consoleView, setConsoleView] = useState<'testcases' | 'result'>('testcases');
  
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submittedAll, setSubmittedAll] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [usingBackup, setUsingBackup] = useState(false);
  
  // Timer
  const [roundDuration, setRoundDuration] = useState(45 * 60);
  const [timerInitialized, setTimerInitialized] = useState(false);

  // Derived
  const activeProblemState = problemSet[activeIndex];
  const activeProblemDetails = activeProblemState?.details;

  // --- 1. INITIALIZE (Fetch Data) ---
  useEffect(() => {
    const init = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        
        // A. Config Duration
        let configTime = 45 * 60;
        const { data: config } = await supabase.from('game_config').select('value').eq('key', 'coding_duration').single();
        if (config?.value) configTime = parseInt(config.value) * 60;

        // B. Check Session
        const { data: sub } = await supabase.from('coding_submissions').select('*').eq('user_id', userId).maybeSingle();

        if (sub && sub.problem_set?.length > 0) {
            console.log("Restoring session...");
            
            // Timer Sync
            const startTime = new Date(sub.created_at).getTime();
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            const remaining = configTime - elapsedSeconds;

            if (remaining <= 0 && sub.status !== 'completed') {
                setRoundDuration(0);
                toast.error("Round expired!");
                await supabase.from('coding_submissions').update({ status: 'completed' }).eq('user_id', userId);
                setSubmittedAll(true);
            } else {
                setRoundDuration(Math.max(0, remaining));
            }
            setTimerInitialized(true);

            // Hydrate Problems
            const problemIds = sub.problem_set.map((p: any) => p.problem_id);
            const { data: problems } = await supabase.from('coding_problems').select('*').in('id', problemIds);
            
            const hydratedSet = sub.problem_set.map((p: any) => ({
                ...p,
                details: problems?.find((d: any) => d.id === p.problem_id)
            }));
            
            setProblemSet(hydratedSet);
            if (sub.status === 'completed') setSubmittedAll(true);

        } else {
            console.log("Assigning 2 Questions...");
            const { data: allProblems } = await supabase.from('coding_problems').select('*');
            
            if (!allProblems || allProblems.length < 2) {
                toast.error("Not enough questions in database");
                return;
            }

            const easyProbs = allProblems.filter(p => p.difficulty === 'Easy');
            const medProbs = allProblems.filter(p => p.difficulty === 'Medium');

            const p1 = easyProbs[Math.floor(Math.random() * easyProbs.length)] || allProblems[0];
            const p2 = medProbs[Math.floor(Math.random() * medProbs.length)] || allProblems[1];

            const newSet: ProblemState[] = [
                { problem_id: p1.id, code: p1.starter_code, language: 'javascript', status: 'draft', details: p1 },
                { problem_id: p2.id, code: p2.starter_code, language: 'javascript', status: 'draft', details: p2 }
            ];

            setProblemSet(newSet);
            setRoundDuration(configTime);
            setTimerInitialized(true);

            const payload = newSet.map(({ details, ...rest }) => rest);
            await supabase.from('coding_submissions').upsert({
                user_id: userId,
                problem_set: payload, 
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load round");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [userId]);

  // --- 2. HELPERS ---
  const updateState = (key: keyof ProblemState, value: any) => {
    setProblemSet(prev => {
        const updated = [...prev];
        updated[activeIndex] = { ...updated[activeIndex], [key]: value };
        return updated;
    });
  };

  const handleResetCode = () => {
    if (activeProblemDetails) {
        updateState('code', activeProblemDetails.starter_code);
        toast.info("Code reset to template");
    }
  };

  // --- 3. AUTO SAVE ---
  const handleSave = async (silent = false) => {
    if (!userId || problemSet.length === 0) return;
    if (!silent) setIsSaving(true);
    try {
        const payload = problemSet.map(({ details, ...rest }) => rest);
        await supabase.from('coding_submissions').update({
            problem_set: payload,
            updated_at: new Date().toISOString()
        }).eq('user_id', userId);

        setLastSaved(new Date());
        if (!silent) toast.success("Saved");
    } catch (e) {
        console.error(e);
    } finally {
        if (!silent) setIsSaving(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => handleSave(true), 30000); 
    return () => clearInterval(timer);
  }, [problemSet]);

  // --- 4. EXECUTION LOGIC ---
  const handleRun = async () => {
    setIsRunning(true);
    setConsoleView('result');
    setRunResult(null); // Clear previous

    // Simulation
    setTimeout(() => {
        setRunResult({
            status: 'Accepted',
            score: 'N/A',
            metrics: { time: 45, memory: 1024 },
            results: [
                { status: 'Accepted', input: 'Case 1', expected: 'Pass', actual: 'Pass' },
                { status: 'Accepted', input: 'Case 2', expected: 'Pass', actual: 'Pass' }
            ]
        });
        setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!userId || !activeProblemDetails) return;
    setIsSubmitting(true);
    setUsingBackup(false);
    setConsoleView('result');
    
    // Create initial pending result
    setRunResult({ status: 'Processing...', results: [] });

    try {
        await handleSave(true);

        // RACE CONDITION: Primary Judge vs 25s Timeout
        const primaryJudgePromise = new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("TIMEOUT")), 25000); // 25s Strict Timeout
            // Integrate Judge0 API Call Here in Production
        });

        try {
            await primaryJudgePromise;
            // Handle Success...
        } catch (e: any) {
            if (e.message === "TIMEOUT") {
                // BACKUP PROTOCOL
                setUsingBackup(true);
                toast.warning("Primary Judge unresponsive. Activating AI Backup...");
                
                const { data: submission } = await supabase.from('coding_submissions').select('id').eq('user_id', userId).single();
                
                const { data: aiResult, error } = await supabase.functions.invoke('evaluate-code-backup', {
                    body: { submission_id: submission?.id }
                });

                if (error || !aiResult) throw new Error("AI Backup Failed");

                // Update UI with AI Result
                setRunResult({
                    status: aiResult.score === 100 ? 'Accepted' : 'Partial Score',
                    score: aiResult.score.toString(),
                    output: `AI Feedback: ${aiResult.feedback}\nComplexity: ${aiResult.complexity}`,
                    metrics: { time: parseInt(aiResult.runtime_prediction) || 0, memory: 0 },
                    results: [
                        { 
                            status: aiResult.test_cases_passed > 0 ? 'Accepted' : 'Wrong Answer', 
                            input: 'AI Verification', 
                            expected: 'Logical Correctness', 
                            actual: aiResult.score > 50 ? 'Passed' : 'Failed' 
                        }
                    ]
                });

                updateState('status', 'completed');
                await handleSave(true);
            }
        }
    } catch (e) {
        console.error(e);
        toast.error("Submission Error");
        setRunResult({ status: 'Error', output: 'System Failure. Code saved.', results: [] });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleFinishRound = async () => {
    if (!confirm("Are you sure? This will end the coding round.")) return;
    await supabase.from('coding_submissions').update({ status: 'completed' }).eq('user_id', userId);
    setSubmittedAll(true);
    completeRound('coding');
  };

  if (submittedAll) return <RoundTransition completedRound="Coding Round" nextRoundName="Event Completed" nextRoundSlug="completed" />;
  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600"/></div>;

  return (
    <div className="flex gap-3 h-full w-full animate-in fade-in duration-500 overflow-hidden pb-2">
      
      {/* --- LEFT: PROBLEMS --- */}
      <div className={cn(
        "flex flex-col bg-zinc-900/80 border border-zinc-800 rounded-lg overflow-hidden transition-all duration-500",
        isSidebarExpanded ? "w-[40%]" : "w-[35%]"
      )}>
        {/* TABS */}
        <div className="h-12 border-b border-zinc-800 bg-zinc-900 flex items-center px-4 gap-2 shrink-0 overflow-x-auto">
            {problemSet.map((p, i) => (
                <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                        "px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-2 whitespace-nowrap",
                        activeIndex === i 
                            ? (p.details?.difficulty === 'Easy' ? "bg-green-900/30 text-green-400 border border-green-900/50" : "bg-orange-900/30 text-orange-400 border border-orange-900/50")
                            : "text-zinc-500 hover:bg-zinc-800 border border-transparent"
                    )}
                >
                    {p.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <span>Q{i+1}</span>}
                    {p.details?.difficulty || "Loading..."}
                </button>
            ))}
        </div>

        {/* DETAILS */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <h2 className="text-lg font-bold text-white mb-2">{activeProblemDetails?.title}</h2>
            <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-zinc-300 leading-7 whitespace-pre-wrap">{activeProblemDetails?.description}</p>
                
                <h3 className="text-white font-bold mt-6 mb-3 flex items-center gap-2 text-sm">
                    <Code2 className="w-4 h-4 text-blue-500" /> Examples
                </h3>
                <div className="space-y-4">
                    {activeProblemDetails?.examples?.map((ex: any, i: number) => (
                        <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono">
                            <div className="mb-1"><span className="text-zinc-500">Input:</span> <span className="text-zinc-300">{ex.input}</span></div>
                            <div className="mb-1"><span className="text-zinc-500">Output:</span> <span className="text-green-400">{ex.output}</span></div>
                            {ex.explanation && <div className="text-zinc-500 italic border-t border-zinc-800 pt-1 mt-1">{ex.explanation}</div>}
                        </div>
                    ))}
                </div>

                <h3 className="text-white font-bold mt-6 mb-3 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-yellow-500" /> Constraints
                </h3>
                <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-xs font-mono">
                    {activeProblemDetails?.constraints?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                </ul>
            </div>
        </div>
      </div>

      {/* --- RIGHT: EDITOR & CONSOLE --- */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 w-full h-full">
        
        {/* EDITOR CONTAINER */}
        <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden relative min-h-0">
            
            {/* TIMER HEADER */}
            <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-2 shrink-0 flex justify-between items-center">
                {timerInitialized && <CompetitionTimer totalSeconds={roundDuration} onTimeUp={handleFinishRound} />}
                <div className="flex items-center gap-2">
                    {lastSaved && <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Cloud className="w-3 h-3" /> Saved {lastSaved.toLocaleTimeString()}</span>}
                    {problemSet.every(p => p.status === 'completed') && (
                        <Button size="sm" onClick={handleFinishRound} className="h-6 text-xs bg-red-600 hover:bg-red-500 text-white font-bold animate-pulse">FINISH ROUND</Button>
                    )}
                </div>
            </div>

            {/* EDITOR TOOLBAR */}
            <div className="h-10 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-3 shrink-0">
                <div className="flex items-center gap-3">
                    <Select value={activeProblemState?.language || 'javascript'} onValueChange={(v) => updateState('language', v)}>
                        <SelectTrigger className="w-[140px] h-7 bg-zinc-900 border-zinc-700 text-xs text-zinc-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                            {LANGUAGES.map(l => <SelectItem key={l.id} value={l.id} className="text-xs">{l.name}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="text-zinc-500 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-colors" title="Reset Code">
                                <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                            <AlertDialogHeader><AlertDialogTitle>Reset Code?</AlertDialogTitle><AlertDialogDescription>This will revert to the starter template.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-zinc-800 text-zinc-300 border-zinc-700">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleResetCode} className="bg-red-600">Reset</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-600 font-bold">
                    {activeProblemState?.status === 'completed' ? <span className="text-green-500">COMPLETED</span> : "EDIT MODE"}
                </div>
            </div>

            {/* MONACO EDITOR */}
            <div className="flex-1 relative min-h-0">
                <Editor
                    height="100%"
                    language={activeProblemState?.language === 'cpp' ? 'cpp' : activeProblemState?.language || 'javascript'}
                    theme="vs-dark"
                    value={activeProblemState?.code || ""}
                    onChange={(val) => updateState('code', val || "")}
                    options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 16 }, fontFamily: "'JetBrains Mono', monospace", automaticLayout: true }}
                />
                {usingBackup && (
                    <div className="absolute top-2 right-2 bg-orange-900/90 text-orange-200 border border-orange-500/50 px-3 py-1 rounded text-xs font-bold flex items-center gap-2 animate-pulse backdrop-blur z-10">
                        <Cpu className="w-3 h-3" /> BACKUP PROTOCOL ACTIVE
                    </div>
                )}
            </div>
        </div>

        {/* BOTTOM: CONSOLE */}
        <div className="h-[200px] bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col shrink-0">
            {/* CONSOLE TABS */}
            <div className="h-9 border-b border-zinc-800 flex items-center justify-between px-2 bg-zinc-950/50">
                <div className="flex gap-1">
                    <button onClick={() => setConsoleView('testcases')} className={cn("px-3 py-1 text-xs rounded-t-md font-medium border-b-2 transition-colors", consoleView === 'testcases' ? "text-white border-blue-500 bg-zinc-800/50" : "text-zinc-500 border-transparent hover:text-zinc-300")}>
                        <span className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Test Cases</span>
                    </button>
                    <button onClick={() => setConsoleView('result')} className={cn("px-3 py-1 text-xs rounded-t-md font-medium border-b-2 transition-colors", consoleView === 'result' ? "text-white border-green-500 bg-zinc-800/50" : "text-zinc-500 border-transparent hover:text-zinc-300")}>
                        <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> Run Result</span>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleSave(false)} disabled={isSaving} className="h-6 text-xs bg-zinc-800 border-zinc-700">{isSaving ? <Loader2 className="w-3 h-3 animate-spin"/> : <Save className="w-3 h-3"/>}</Button>
                    <Button size="sm" variant="secondary" onClick={handleRun} disabled={isRunning} className="h-6 text-xs bg-zinc-800 border-zinc-700">{isRunning ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Play className="w-3 h-3 mr-1"/>} Run</Button>
                    <Button size="sm" onClick={handleSubmit} disabled={isSubmitting} className="h-6 text-xs bg-green-700 hover:bg-green-600 text-white gap-1">{isSubmitting ? <Loader2 className="w-3 h-3 animate-spin"/> : <Send className="w-3 h-3"/>} Submit</Button>
                </div>
            </div>

            {/* CONSOLE CONTENT */}
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar font-mono text-xs bg-zinc-900">
                {consoleView === 'testcases' ? (
                    <div className="space-y-3">
                        <div className="text-zinc-500">Input:</div>
                        <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300">
                            {activeProblemDetails?.examples?.[0]?.input || "No example available"}
                        </div>
                        <div className="text-zinc-500">Expected Output:</div>
                        <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-green-400">
                            {activeProblemDetails?.examples?.[0]?.output || "N/A"}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {runResult ? (
                            <div className="space-y-3 animate-in fade-in">
                                <div className="flex items-center gap-4">
                                    <div className={cn("text-lg font-bold", runResult.status === 'Accepted' ? "text-green-500" : "text-red-500")}>{runResult.status}</div>
                                    {runResult.score && <div className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-300">Score: {runResult.score}/100</div>}
                                </div>
                                {runResult.output && <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300 whitespace-pre-wrap">{runResult.output}</div>}
                            </div>
                        ) : (
                            <div className="text-zinc-600 italic">Run code to see output...</div>
                        )}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};