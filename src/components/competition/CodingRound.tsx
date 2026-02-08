import React, { useState, useEffect, useCallback } from 'react';
import Editor from "@monaco-editor/react";
import { Play, Send, RefreshCw, Terminal, CheckCircle2, XCircle, Code2, AlertCircle, Cpu, Lock, Unlock, AlertTriangle, Cloud, Loader2, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompetitionTimer } from './CompetitionTimer';
import { useCompetitionStore } from '@/store/competitionStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabaseClient';
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
import { RoundTransition } from './RoundTransition';

// --- CONFIG ---
const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript (Node 18)' },
  { id: 'python', name: 'Python 3' },
  { id: 'cpp', name: 'C++ (GCC)' },
  { id: 'c', name: 'C (GCC)' },
  { id: 'java', name: 'Java (OpenJDK)' },
];

const PROBLEM_TEMPLATES: Record<string, Record<string, string>> = {
  default: {
    javascript: "// Write your solution here\nfunction solve() {\n  \n}",
    python: "# Write your solution here\ndef solve():\n    pass",
    cpp: "// Write your solution here\n#include <iostream>\nusing namespace std;\n\nvoid solve() {\n    \n}",
    c: "// Write your solution here\n#include <stdio.h>\n\nvoid solve() {\n    \n}",
    java: "// Write your solution here\npublic class Solution {\n    public void solve() {\n        \n    }\n}"
  }
};

const getStarterCode = (title: string, lang: string, dbCode: string) => {
  if (dbCode && dbCode.length > 10) {
      if (lang === 'javascript' && dbCode.includes('function')) return dbCode;
      if (lang === 'python' && dbCode.includes('def')) return dbCode;
      if (lang === 'cpp' && dbCode.includes('#include')) return dbCode;
      if (lang === 'c' && dbCode.includes('#include')) return dbCode;
      if (lang === 'java' && dbCode.includes('class')) return dbCode;
  }
  return PROBLEM_TEMPLATES.default[lang] || "// Write code here";
};

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
  isLocked?: boolean;
  runResult?: any;
  details?: CodingProblem; 
}

export const CodingRound = ({ isSidebarExpanded = false }: { isSidebarExpanded?: boolean }) => {
  const { completeRound, email, userId, incrementTabSwitch } = useCompetitionStore();

  // --- STATE ---
  const [problemSet, setProblemSet] = useState<ProblemState[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [consoleView, setConsoleView] = useState<'testcases' | 'result'>('testcases');
  const [activeTab, setActiveTab] = useState<'case1' | 'case2'>('case1');
  
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submittedAll, setSubmittedAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [usedBackup, setUsedBackup] = useState(false); // Retained from File 1 (Hybrid Logic)

  // Dialogs
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitStats, setSubmitStats] = useState<{ score: number; details: string; outcomes: string[] } | null>(null);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  // Derived Accessors
  const activeProblemState = problemSet[activeIndex];
  const activeProblemDetails = activeProblemState?.details;
  const isLocked = activeProblemState?.isLocked || false;
  const runResult = activeProblemState?.runResult;

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // --- 1. INIT ---
  useEffect(() => {
    const init = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const { data: config } = await supabase.from('game_config').select('value').eq('key', 'coding_duration').single();
        const DURATION_MINUTES = config?.value ? parseInt(config.value) : 45;

        const { data: session } = await supabase.from('exam_sessions').select('coding_start_time').eq('user_id', userId).single();
        let startTime = session?.coding_start_time;

        if (!startTime) {
          startTime = new Date().toISOString();
          await supabase.from('exam_sessions').upsert({ user_id: userId, coding_start_time: startTime }, { onConflict: 'user_id' });
        }
        setEndTime(new Date(new Date(startTime).getTime() + DURATION_MINUTES * 60000).toISOString());

        const { data: sub } = await supabase.from('coding_submissions').select('*').eq('user_id', userId).maybeSingle();

        if (sub && sub.problem_set?.length > 0) {
            console.log("Restoring session...");
            const problemIds = sub.problem_set.map((p: any) => p.problem_id);
            const { data: problems } = await supabase.from('coding_problems').select('*').in('id', problemIds);
            
            const hydratedSet = sub.problem_set.map((p: any) => ({
                ...p,
                details: problems?.find((d: any) => d.id === p.problem_id)
            }));
            
            setProblemSet(hydratedSet);
            if (sub.status === 'completed') setSubmittedAll(true);
            toast.success("Session Restored", { icon: <RefreshCw className="w-4 h-4" /> });

        } else {
            console.log("Fetching new questions...");
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

  // --- 2. UPDATERS ---
  const updateActiveState = (updates: Partial<ProblemState>) => {
    setProblemSet(prev => {
        const updated = [...prev];
        updated[activeIndex] = { ...updated[activeIndex], ...updates };
        return updated;
    });
  };

  const handleLanguageChange = (newLang: string) => {
    if (isLocked) return;
    const newCode = getStarterCode(activeProblemDetails?.title || "", newLang, activeProblemDetails?.starter_code || "");
    updateActiveState({ 
        language: newLang, 
        code: newCode,
        runResult: null 
    });
  };

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

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        incrementTabSwitch();
        toast.warning('Tab switch detected!', { icon: <AlertTriangle className="w-4 h-4 text-orange-500" /> });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [incrementTabSwitch]);

  // --- 3. HYBRID EXECUTION LOGIC (JUDGE0 + 30s FALLBACK) ---
  const executeResult = async (problemIndex: number, isSubmission: boolean) => {
    const problem = problemSet[problemIndex];
    if (!problem.details) return { status: 'Error', output: 'Problem Details Missing' };

    // --- A. Define Judge0 Task ---
    const primaryJudgePromise = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: problem.code,
                    language: problem.language,
                    problemId: problem.problem_id,
                    title: problem.details?.title,
                    teamName: email || 'Anonymous',
                    userId: userId,
                    isSubmission,
                    testCases: problem.details?.examples
                }),
            });

            if (!response.ok) throw new Error("Network Error"); 

            const initData = await response.json();
            if (initData.error) throw new Error(initData.error || "Judge0 Error");

            const jobId = initData.job_id;
            if (!jobId) throw new Error("No Job ID returned");

            // Polling Loop
            for (let i = 0; i < 20; i++) { // ~40s Max (but handled by race)
                await new Promise(r => setTimeout(r, 2000));
                const statusRes = await fetch(`${API_BASE_URL}/api/status/${jobId}`);
                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    if (['completed', 'success', 'error'].includes(statusData.status)) {
                        // MERGED LOGIC FROM FILE 2: Recalculate status based on results
                        if (statusData.results && statusData.results.length > 0) {
                            const allPassed = statusData.results.every((r: any) => r.status === 'Accepted');
                            statusData.status = allPassed ? 'Accepted' : 'Wrong Answer';
                        }
                        return statusData;
                    }
                }
            }
            throw new Error("Judge0 Loop Ended"); 
        } catch (e) {
            throw e; 
        }
    };

    // --- B. Define AI Backup Task (From File 1) ---
    const backupAiPromise = async () => {
        setUsedBackup(true);
        console.warn(`⚠️ Primary Judge Timeout (>30s). Activating Backup.`);
        
        const { data: submission } = await supabase.from('coding_submissions').select('id').eq('user_id', userId).single();
        const { data: aiResult, error } = await supabase.functions.invoke('evaluate-code-backup', {
            body: { 
                submission_id: submission?.id,
                target_problem_id: problem.problem_id,
                current_code: problem.code,
                current_lang: problem.language
            }
        });

        if (error || !aiResult) throw new Error("AI Backup Failed");

        return {
            status: aiResult.score >= 50 ? 'Accepted' : 'Wrong Answer',
            score: aiResult.score.toString(),
            output: `[AI JUDGE] ${aiResult.feedback}\nComplexity: ${aiResult.complexity}`,
            results: [
                { status: aiResult.score > 0 ? 'Accepted' : 'Wrong Answer', input: 'AI Logic Check', expected: 'Pass', actual: aiResult.score > 0 ? 'Pass' : 'Fail' },
                { status: aiResult.score === 100 ? 'Accepted' : 'Wrong Answer', input: 'Edge Cases', expected: 'Optimal', actual: aiResult.score === 100 ? 'Pass' : 'Fail' }
            ]
        };
    };

    // --- C. The Race (30s Strict) ---
    try {
        const result = await Promise.race([
            primaryJudgePromise(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), 30000)) // 30s Timeout
        ]);
        return result;

    } catch (error: any) {
        // Handle Timeout or Network Failure by switching to Backup
        if (error.message === "TIMEOUT" || error.message === "Network Error" || error.message === "Failed to fetch") {
            toast.warning(`Primary Judge slow for Q${problemIndex + 1}. Switching to AI...`);
            try {
                return await backupAiPromise();
            } catch (aiErr) {
                console.error("Critical Failure:", aiErr);
                return { status: 'Error', output: 'System Failure. Code Saved.', results: [], score: 0 };
            }
        }
        // Standard Execution Error (e.g. Compilation Error from Judge0)
        return { 
            status: 'Error', 
            output: `Execution Failed: ${error.message}`, 
            results: [], 
            score: 0 
        };
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setConsoleView('result');
    updateActiveState({ runResult: null });

    const result = await executeResult(activeIndex, false); 
    
    updateActiveState({ runResult: result });
    setIsRunning(false);
  };

  const handleLockCurrent = async () => {
    if (isLocked) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Verifying & Locking...");

    try {
        await handleSave(true);
        const result = await executeResult(activeIndex, true);

        updateActiveState({ runResult: result });
        
        if (result.status !== 'Error') {
            updateActiveState({ status: 'completed', isLocked: true });
            toast.success(`Question Locked!`, { id: toastId });
        } else {
            toast.error("Execution Error - Cannot Lock", { id: toastId });
        }
        await handleSave(true);

    } catch (e) {
        toast.error("Locking Failed", { id: toastId });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleFinishRound = async () => {
    setSubmittedAll(true);
    await supabase.from('coding_submissions').update({ status: 'completed' }).eq('user_id', userId);
    completeRound('coding');
  };

  const handleTimeUp = useCallback(() => {
    toast.error("Time Up! Submitting...");
    handleFinishRound();
  }, []);

  const allProblemsLocked = problemSet.every(p => p.status === 'completed');

  if (submittedAll) return <RoundTransition completedRound="Coding Round" nextRoundName="Event Completed" nextRoundSlug="completed" />;
  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600"/></div>;
  if (problemSet.length === 0) return <div className="h-full flex items-center justify-center text-zinc-500">Failed to load problems.</div>;

  return (
    <div className="flex gap-3 h-full w-full animate-in fade-in duration-500 overflow-hidden pb-2">
      
      {/* --- LEFT: PROBLEMS --- */}
      <div className={cn("flex flex-col bg-zinc-900/80 border border-zinc-800 rounded-lg overflow-hidden transition-all duration-500", isSidebarExpanded ? "w-[40%]" : "w-[35%]")}>
        <div className="h-12 border-b border-zinc-800 bg-zinc-900 flex items-center px-4 justify-between shrink-0">
          <Tabs value={activeIndex.toString()} onValueChange={(v) => setActiveIndex(parseInt(v))} className="w-full">
            <TabsList className="bg-zinc-800/50">
                {problemSet.map((p, i) => (
                    <TabsTrigger key={i} value={i.toString()} className="text-xs">
                        {p.isLocked && <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />}
                        Question {i + 1}
                    </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="font-bold text-white truncate">{activeProblemDetails?.title}</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
            {activeProblemDetails?.difficulty}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-zinc-300 leading-7 whitespace-pre-wrap">{activeProblemDetails?.description}</p>
            
            <h3 className="text-white font-bold mt-6 mb-3 flex items-center gap-2 text-sm"><Code2 className="w-4 h-4 text-blue-500" /> Examples</h3>
            <div className="space-y-4">
              {activeProblemDetails?.examples?.map((ex: any, i: number) => (
                <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono">
                  <div className="mb-1"><span className="text-zinc-500">Input:</span> <span className="text-zinc-300">{ex.input}</span></div>
                  <div className="mb-1"><span className="text-zinc-500">Output:</span> <span className="text-green-400">{ex.output}</span></div>
                  {ex.explanation && <div className="text-zinc-500 italic border-t border-zinc-800 pt-1 mt-1">{ex.explanation}</div>}
                </div>
              ))}
            </div>

            <h3 className="text-white font-bold mt-6 mb-3 flex items-center gap-2 text-sm"><AlertCircle className="w-4 h-4 text-yellow-500" /> Constraints</h3>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-xs font-mono">
              {activeProblemDetails?.constraints?.map((c: string, i: number) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* --- RIGHT: EDITOR & CONSOLE --- */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 w-full h-full">
        <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden relative">
          
          <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-2 shrink-0 flex justify-between items-center">
            <CompetitionTimer totalSeconds={2700} targetDate={endTime} onTimeUp={handleTimeUp} />
            <div className="flex gap-2 items-center">
                {allProblemsLocked && (
                    <Button size="sm" onClick={() => setShowFinishConfirm(true)} className="h-7 text-xs bg-red-600 hover:bg-red-500 text-white font-bold animate-pulse">
                        <Flag className="w-3 h-3 mr-1" /> FINISH ROUND
                    </Button>
                )}
                {lastSaved && <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Cloud className="w-3 h-3" /> Saved</span>}
            </div>
          </div>

          <div className="h-10 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-3 shrink-0">
            <div className="flex items-center gap-3">
              <Select value={activeProblemState?.language || 'javascript'} onValueChange={handleLanguageChange} disabled={isLocked}>
                <SelectTrigger className="w-[140px] h-7 bg-zinc-900 border-zinc-700 text-xs text-zinc-300"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                  {LANGUAGES.map(l => <SelectItem key={l.id} value={l.id} className="text-xs">{l.name}</SelectItem>)}
                </SelectContent>
              </Select>

              <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border", isLocked ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20")}>
                {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />} {isLocked ? "Locked" : "Editable"}
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button disabled={isLocked} className="text-zinc-500 hover:text-red-400 p-1.5 rounded disabled:opacity-30"><RefreshCw className="w-3.5 h-3.5" /></button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                  <AlertDialogHeader><AlertDialogTitle>Reset Code?</AlertDialogTitle><AlertDialogDescription>Reverts to starter template.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-zinc-800 text-zinc-300 border-zinc-700">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => updateActiveState({ code: getStarterCode(activeProblemDetails?.title || "", activeProblemState.language, activeProblemDetails?.starter_code || "") })} className="bg-red-600">Reset</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="flex-1 relative">
            <Editor
              key={`${activeIndex}-${activeProblemState?.language}`} 
              height="100%"
              language={activeProblemState?.language === 'cpp' ? 'cpp' : activeProblemState?.language || 'javascript'}
              value={activeProblemState?.code || ""}
              onChange={(v) => !isLocked && updateActiveState({ code: v || '' })}
              theme="vs-dark"
              options={{ readOnly: isLocked, minimap: { enabled: false }, fontSize: 13, padding: { top: 16 }, fontFamily: "'JetBrains Mono', monospace", automaticLayout: true }}
            />
            {usedBackup && (
                <div className="absolute top-2 right-2 bg-purple-900/80 text-purple-200 border border-purple-500/50 px-3 py-1 rounded text-xs font-bold flex items-center gap-2 animate-pulse backdrop-blur z-10">
                    <Cpu className="w-3 h-3" /> AI BACKUP ACTIVE
                </div>
            )}
          </div>
        </div>

        {/* BOTTOM: CONSOLE */}
        <div className="h-[240px] bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col shrink-0">
          <div className="h-9 border-b border-zinc-800 flex items-center justify-between px-2 bg-zinc-950/50">
            <div className="flex gap-1">
              <button onClick={() => setConsoleView('testcases')} className={cn("px-3 py-1 text-xs rounded-t-md font-medium border-b-2 transition-colors", consoleView === 'testcases' ? "text-white border-blue-500 bg-zinc-800/50" : "text-zinc-500 border-transparent")}>Test Cases</button>
              <button onClick={() => setConsoleView('result')} className={cn("px-3 py-1 text-xs rounded-t-md font-medium border-b-2 transition-colors", consoleView === 'result' ? "text-white border-green-500 bg-zinc-800/50" : "text-zinc-500 border-transparent")}>Run Result</button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={handleRun} disabled={isRunning || isSubmitting} className="h-6 text-xs bg-zinc-800 border-zinc-700">
                {isRunning ? <RefreshCw className="w-3 h-3 animate-spin mr-1"/> : <Play className="w-3 h-3 mr-1"/>} Run
              </Button>
              <Button size="sm" onClick={handleLockCurrent} disabled={isSubmitting || isRunning || isLocked} className={cn("h-6 text-xs border", isLocked ? "bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed" : "bg-green-700 border-green-600 text-white")}>
                {isSubmitting ? <RefreshCw className="w-3 h-3 animate-spin mr-1"/> : <Lock className="w-3 h-3 mr-1"/>} {isLocked ? "Locked" : "Lock & Save"}
              </Button>
            </div>
          </div>

          <div className="flex-1 p-3 overflow-y-auto custom-scrollbar font-mono text-xs bg-zinc-900">
            {consoleView === 'testcases' ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab('case1')} className={cn("px-3 py-1 rounded border", activeTab === 'case1' ? "bg-zinc-800 border-zinc-600 text-white" : "text-zinc-500 border-zinc-800")}>Case 1</button>
                  <button onClick={() => setActiveTab('case2')} className={cn("px-3 py-1 rounded border", activeTab === 'case2' ? "bg-zinc-800 border-zinc-600 text-white" : "text-zinc-500 border-zinc-800")}>Case 2</button>
                </div>
                <div className="space-y-4">
                  <div><div className="text-zinc-500 mb-1">Input:</div><div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300">{activeProblemDetails?.examples?.[activeTab === 'case1' ? 0 : 1]?.input || "N/A"}</div></div>
                  <div><div className="text-zinc-500 mb-1">Expected:</div><div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-green-400">{activeProblemDetails?.examples?.[activeTab === 'case1' ? 0 : 1]?.output || "N/A"}</div></div>
                  {runResult && (
                    <div>
                        <div className="text-zinc-500 mb-1">Actual:</div>
                        <div className={cn("p-2 rounded border border-zinc-800 text-zinc-300", 
                            runResult.results?.[activeTab === 'case1' ? 0 : 1]?.status === 'Accepted' ? 'border-green-900/50 bg-green-950/10' : 'border-red-900/50 bg-red-950/10'
                        )}>
                            {runResult.results?.[activeTab === 'case1' ? 0 : 1]?.actual || "N/A"}
                        </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {isRunning || isSubmitting ? (
                    <div className="text-zinc-400 animate-pulse">Running Code on Judge0...</div>
                ) : runResult ? (
                  <div className="space-y-4 animate-in fade-in">
                    {/* Status Header */}
                    <div className="flex items-center gap-4">
                      <div className={cn("text-lg font-bold", runResult.status === 'Accepted' ? "text-green-500" : "text-red-500")}>
                        {runResult.status}
                      </div>
                      {runResult.score && <div className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-300">Score: {runResult.score}/100</div>}
                    </div>

                    {/* Detailed Test Results */}
                    {runResult.results && runResult.results.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-zinc-500 font-bold mb-1">Test Case Breakdown:</h4>
                            {runResult.results.map((res: any, idx: number) => (
                                <div key={idx} className="flex flex-col gap-1 p-2 bg-zinc-950 rounded border border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        {res.status === 'Accepted' ? <CheckCircle2 className="w-4 h-4 text-green-500"/> : <XCircle className="w-4 h-4 text-red-500"/>}
                                        <span className="font-bold text-zinc-300">Test Case {idx + 1}</span>
                                        <span className={cn("text-[10px] uppercase", res.status === 'Accepted' ? "text-green-500" : "text-red-500")}>{res.status}</span>
                                    </div>
                                    {res.status !== 'Accepted' && res.expected && (
                                        <div className="pl-6 text-[10px] text-zinc-500 grid grid-cols-2 gap-2 mt-1">
                                            <div>Expected: <span className="text-zinc-300">{res.expected}</span></div>
                                            <div>Actual: <span className="text-red-300">{res.actual}</span></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Raw Output (For compilation errors) */}
                    {runResult.output && !runResult.results?.length && (
                        <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300 whitespace-pre-wrap font-mono text-xs">
                            {runResult.output}
                        </div>
                    )}
                  </div>
                ) : <div className="text-zinc-600 italic">Run code to see output.</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRM FINISH DIALOG */}
      <AlertDialog open={showFinishConfirm} onOpenChange={setShowFinishConfirm}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500 flex items-center gap-2"><Flag className="w-5 h-5"/> Finish Round?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
                You have locked both answers. This will submit your final score and end the round. This action cannot be undone.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-zinc-300 border-zinc-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinishRound} className="bg-red-600 hover:bg-red-700">Yes, Finish</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};