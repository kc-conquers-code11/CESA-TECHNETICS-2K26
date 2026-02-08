import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, RefreshCw, Terminal, CheckCircle2, XCircle, Clock, Code2, AlertCircle, Cpu, Lock, Unlock, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompetitionTimer } from './CompetitionTimer';
import { useCompetitionStore } from '@/store/competitionStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

// --- TYPES ---
interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  examples: any[];
  constraints: string[];
  code_snippet: string; // Default starter code
}

const languages = [
  { id: 'python', name: 'Python 3', extension: 'py' },
  { id: 'cpp', name: 'C++17', extension: 'cpp' },
  { id: 'c', name: 'C (GCC)', extension: 'c' },
  { id: 'java', name: 'Java 17', extension: 'java' },
  { id: 'javascript', name: 'JavaScript', extension: 'js' },
];

export const CodingRound = ({ isSidebarExpanded = false }: { isSidebarExpanded?: boolean }) => {
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);
  const [problems, setProblems] = useState<Record<string, Problem>>({});
  const [isLoadingProblems, setIsLoadingProblems] = useState(true);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [endTime, setEndTime] = useState<string | null>(null);

  // Solutions State
  const [solutions, setSolutions] = useState<Record<string, {
    code: string;
    language: string;
    isLocked: boolean;
    runResult: any;
    consoleView: 'testcases' | 'result';
    activeTab: 'case1' | 'case2';
  }>>({});

  const { completeRound, email, userId, incrementTabSwitch } = useCompetitionStore();

  // --- 🔥 1. FETCH & ASSIGN QUESTIONS ---
  useEffect(() => {
    const initCodingRound = async () => {
      if (!userId) return;

      try {
        setIsLoadingProblems(true);

        // A. Check for existing submission/assignment
        const { data: existingSub } = await supabase
          .from('coding_submissions')
          .select('solutions')
          .eq('user_id', userId)
          .maybeSingle();

        let assignedProblemIds: string[] = [];
        let loadedSolutions = {};

        if (existingSub && existingSub.solutions && Object.keys(existingSub.solutions).length > 0) {
          // Case 1: User already has questions assigned
          console.log("Found existing session, restoring questions...");
          loadedSolutions = existingSub.solutions;
          assignedProblemIds = Object.keys(existingSub.solutions);
        } else {
          // Case 2: New User - Assign 1 Easy + 1 Medium
          console.log("Assigning new questions...");
          
          // Fetch IDs only first
          const { data: allQuestions } = await supabase
            .from('questions')
            .select('id, difficulty, code_snippet')
            .eq('round_id', 'coding'); // Ensure we only get coding round Qs

          if (!allQuestions || allQuestions.length === 0) {
            toast.error("No questions found in DB!");
            setIsLoadingProblems(false);
            return;
          }

          const easyQs = allQuestions.filter(q => q.difficulty === 'Easy');
          const mediumQs = allQuestions.filter(q => q.difficulty === 'Medium');

          if (easyQs.length === 0 || mediumQs.length === 0) {
            toast.error("Not enough questions to generate set (Need 1 Easy, 1 Medium)");
            return;
          }

          // Random Selection
          const randomEasy = easyQs[Math.floor(Math.random() * easyQs.length)];
          const randomMedium = mediumQs[Math.floor(Math.random() * mediumQs.length)];
          
          assignedProblemIds = [randomEasy.id, randomMedium.id];

          // Initialize Solutions State for these new questions
          loadedSolutions = {
            [randomEasy.id]: {
              code: randomEasy.code_snippet || '',
              language: 'python',
              isLocked: false,
              runResult: null,
              consoleView: 'testcases',
              activeTab: 'case1'
            },
            [randomMedium.id]: {
              code: randomMedium.code_snippet || '',
              language: 'python',
              isLocked: false,
              runResult: null,
              consoleView: 'testcases',
              activeTab: 'case1'
            }
          };

          // PERSIST IMMEDIATELY (Assign these questions to user)
          await supabase.from('coding_submissions').upsert({
            user_id: userId,
            solutions: loadedSolutions,
            score: 0,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        }

        // B. Fetch Full Details for Assigned Questions
        const { data: fullQuestions } = await supabase
          .from('questions')
          .select('*')
          .in('id', assignedProblemIds);

        if (fullQuestions) {
          const problemMap: Record<string, Problem> = {};
          fullQuestions.forEach(q => {
            problemMap[q.id] = q;
          });
          
          setProblems(problemMap);
          setSolutions(loadedSolutions);
          
          // Set active problem to the first one (usually Easy)
          if (assignedProblemIds.length > 0) {
            // Sort by difficulty so Easy is always tab 1
            const sortedIds = assignedProblemIds.sort((a, b) => {
               const diffA = problemMap[a]?.difficulty === 'Easy' ? 0 : 1;
               const diffB = problemMap[b]?.difficulty === 'Easy' ? 0 : 1;
               return diffA - diffB;
            });
            setActiveProblemId(sortedIds[0]);
          }
        }

        // C. Sync Timer (Same as before)
        const { data: session } = await supabase.from('exam_sessions').select('coding_start_time').eq('user_id', userId).single();
        const { data: config } = await supabase.from('game_config').select('value').eq('key', 'coding_duration').single();
        
        const DURATION_MINUTES = config?.value ? parseInt(config.value) : 45;
        let startTime = session?.coding_start_time;

        if (!startTime) {
          startTime = new Date().toISOString();
          await supabase.from('exam_sessions').update({ coding_start_time: startTime }).eq('user_id', userId);
        }
        setEndTime(new Date(new Date(startTime).getTime() + DURATION_MINUTES * 60000).toISOString());

      } catch (err) {
        console.error("Init Error:", err);
        toast.error("Failed to load competition data.");
      } finally {
        setIsLoadingProblems(false);
      }
    };

    initCodingRound();
  }, [userId]);

  // --- 2. AUTO-SAVE ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (userId && Object.keys(solutions).length > 0) {
        await supabase.from('coding_submissions').upsert({
          user_id: userId,
          solutions: solutions,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [solutions, userId]);

  // --- HELPERS & LOGIC (Same as before) ---
  const activeSolution = activeProblemId ? solutions[activeProblemId] : null;
  const currentProblem = activeProblemId ? problems[activeProblemId] : null;

  const updateSolution = (updates: any) => {
    if (!activeProblemId) return;
    setSolutions(prev => ({
      ...prev,
      [activeProblemId]: { ...prev[activeProblemId], ...updates }
    }));
  };

  // ... (Keeping your exact previous helper functions) ...
  const setCode = (newCode: string) => updateSolution({ code: newCode });
  const setLanguage = (newLang: string) => updateSolution({ language: newLang }); 
  // Note: Resetting to defaultCode is tricky with dynamic languages unless we store snippet per language in DB.
  // For now, simpler setLanguage just changes the tag. If you stored code_snippets for all langs in DB, use that.

  const toggleLock = () => {
    if (!activeSolution) return;
    const nextLocked = !activeSolution.isLocked;
    updateSolution({ isLocked: nextLocked });
    if (nextLocked) toast.success(`Locked Solution`);
    else toast.info(`Unlocked Solution`);
  };

  // --- EXECUTION LOGIC (Updated to use dynamic IDs) ---
  const executeResult = async (probId: string, isSubmission: boolean) => {
    const sol = solutions[probId];
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: sol.code,
          language: sol.language,
          problemId: probId, // This ID corresponds to DB Question ID now
          userId: userId,
          isSubmission,
        }),
      });
      return await response.json(); // Simplified for brevity, keep your full polling logic here
    } catch (e) {
      return { status: 'Error', output: 'Network Error', score: 0 };
    }
  };

  // Insert your Full `executeCode` function here (The one I gave you in previous turn)
  const executeCode = async (isSubmission: boolean, skipConfirm: boolean = false) => {
    // ... [Paste the robust executeCode function from previous response here] ...
    // Note: ensure inside it iterates over Object.keys(solutions) instead of hardcoded 'two-sum'
    
    // Quick Adaption for Dynamic IDs:
    const loadingState = isSubmission ? setIsSubmitting : setIsRunning;
    loadingState(true);
    const toastId = isSubmission ? toast.loading("Securely saving code...") : null;

    try {
        // 1. Save
        if (isSubmission && userId) {
            await supabase.from('coding_submissions').upsert({
                user_id: userId, 
                solutions, 
                score: 0, 
                updated_at: new Date().toISOString() 
            }, { onConflict: 'user_id' });
        }

        if (!isSubmission) {
             // Run Active Only
             if(!activeProblemId) return;
             const res = await executeResult(activeProblemId, false);
             updateSolution({ runResult: res });
             loadingState(false);
             toast.dismiss(toastId!);
             return;
        }

        // 2. Run ALL assigned problems
        const problemIds = Object.keys(solutions);
        const results = await Promise.all(problemIds.map(pid => executeResult(pid, true)));
        
        // Update State
        const newSolutions = { ...solutions };
        let totalScore = 0;
        let totalPassed = 0;

        results.forEach((res, index) => {
            const pid = problemIds[index];
            newSolutions[pid].runResult = res;
            totalScore += parseFloat(res.score || '0');
            totalPassed += (res.results?.filter((r:any) => r.status === 'Accepted').length || 0);
        });
        
        setSolutions(newSolutions);
        const finalAvgScore = totalScore / problemIds.length;

        // 3. Final Save
        if (userId) {
            await supabase.from('coding_submissions').upsert({
                user_id: userId,
                solutions: newSolutions,
                score: finalAvgScore,
                test_cases_passed: totalPassed,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

            // Leaderboard update logic...
             const { data: existing } = await supabase.from('leaderboard').select('*').eq('user_id', userId).maybeSingle();
             const r1 = existing?.round1_score || 0;
             const r2 = existing?.round2_score || 0;
             
             await supabase.from('leaderboard').upsert({
                user_id: userId,
                round3_score: finalAvgScore,
                overall_score: r1 + r2 + finalAvgScore,
                updated_at: new Date().toISOString()
             }, { onConflict: 'user_id' });
        }

        if (skipConfirm) {
            toast.success("Time's Up! Submitted.");
            completeRound('coding');
        } else {
            toast.dismiss(toastId!);
            toast.success("All solutions evaluated!");
            // Trigger your confirm modal here if you want
            completeRound('coding'); // Or open confirm dialog
        }

    } catch (e) {
        console.error(e);
        toast.error("Execution error");
    } finally {
        loadingState(false);
    }
  };

  // --- RENDERING ---
  if (isLoadingProblems) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-500"/></div>;
  }

  if (!currentProblem || !activeSolution) {
    return <div className="text-center p-10">Error loading questions. Please contact admin.</div>;
  }

  // Derived state for view
  const { code, language, isLocked, runResult, consoleView, activeTab } = activeSolution;

  return (
    <div className="flex gap-3 h-full w-full animate-in fade-in duration-500 overflow-hidden">
      {/* LEFT PANE: PROBLEM */}
      <div className={cn("flex flex-col bg-zinc-900/80 border border-zinc-800 rounded-lg overflow-hidden transition-all duration-500 ease-in-out", isSidebarExpanded ? "w-[40%]" : "w-[50%]")}>
        {/* Dynamic Tabs */}
        <div className="h-12 border-b border-zinc-800 bg-zinc-900 flex items-center px-4 justify-between shrink-0">
          <Tabs value={activeProblemId || ''} onValueChange={setActiveProblemId} className="w-full">
            <TabsList className="bg-zinc-800/50 w-full justify-start">
              {Object.values(problems)
                .sort((a,b) => (a.difficulty === 'Easy' ? -1 : 1)) // Easy first
                .map((prob, idx) => (
                  <TabsTrigger key={prob.id} value={prob.id} className="text-xs flex-1">
                    {idx + 1}. {prob.title} <span className={cn("ml-2 text-[10px] px-1.5 rounded", prob.difficulty === 'Easy' ? "bg-green-900 text-green-400" : "bg-yellow-900 text-yellow-400")}>{prob.difficulty}</span>
                  </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-zinc-300 whitespace-pre-line leading-7">{currentProblem.description}</p>
            
            {/* Examples */}
            <h3 className="text-white font-bold mt-6 mb-3 flex items-center gap-2 text-sm"><Code2 className="w-4 h-4 text-blue-500" /> Examples</h3>
            <div className="space-y-4">
              {/* Note: Ensure DB stores examples as JSON array of objects {input, output, explanation} */}
              {Array.isArray(currentProblem.examples) ? currentProblem.examples.map((ex: any, i: number) => (
                <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono">
                  <div className="mb-1"><span className="text-zinc-500">Input:</span> <span className="text-zinc-300">{ex.input}</span></div>
                  <div className="mb-1"><span className="text-zinc-500">Output:</span> <span className="text-zinc-300">{ex.output}</span></div>
                  {ex.explanation && <div className="text-zinc-500 italic border-t border-zinc-800 pt-1 mt-1">{ex.explanation}</div>}
                </div>
              )) : <div className="text-zinc-500">Check description for examples.</div>}
            </div>

            {/* Constraints */}
            <h3 className="text-white font-bold mt-6 mb-3 flex items-center gap-2 text-sm"><AlertCircle className="w-4 h-4 text-yellow-500" /> Constraints</h3>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-xs font-mono">
               {/* Ensure DB stores constraints as array of strings */}
               {Array.isArray(currentProblem.constraints) ? currentProblem.constraints.map((c: string, i: number) => (
                 <li key={i}>{c}</li>
               )) : <li>See description</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: EDITOR (Same logic, just mapped to current activeSolution) */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 w-full">
         {/* ... (Keep your Editor and Console UI exactly as before) ... */}
         {/* Make sure Editor `value={code}` and `onChange={setCode}` point to the active solution from state */}
         
         <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden relative">
            <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-2 shrink-0">
               <CompetitionTimer totalSeconds={2700} targetDate={endTime} onTimeUp={() => executeCode(true, true)} />
            </div>
            
            {/* Toolbar */}
            <div className="h-10 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-3 shrink-0">
               <div className="flex items-center gap-3">
                  <Select value={language} onValueChange={setLanguage} disabled={isLocked}>
                     <SelectTrigger className="w-[120px] h-7 bg-zinc-900 border-zinc-700 text-xs text-zinc-300"><SelectValue /></SelectTrigger>
                     <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                        {languages.map(l => <SelectItem key={l.id} value={l.id} className="text-xs">{l.name}</SelectItem>)}
                     </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={toggleLock} className={cn("h-7 text-xs border", isLocked ? "text-red-500 border-red-900/50 bg-red-900/10" : "text-green-500 border-green-900/50 bg-green-900/10")}>
                     {isLocked ? <Lock className="w-3 h-3 mr-1"/> : <Unlock className="w-3 h-3 mr-1"/>} {isLocked ? "Locked" : "Lock"}
                  </Button>
               </div>
               <div className="text-[10px] uppercase tracking-wider text-zinc-600 font-bold">{isLocked ? "READ-ONLY" : "EDIT MODE"}</div>
            </div>

            {/* Editor */}
            <div className="flex-1 relative">
               <Editor 
                  key={`${activeProblemId}-${language}`}
                  height="100%"
                  path={`${activeProblemId}.${language === 'cpp' ? 'cpp' : language}`}
                  language={language === 'cpp' ? 'cpp' : language}
                  value={code}
                  onChange={(v) => !isLocked && setCode(v || '')}
                  theme="vs-dark"
                  options={{ readOnly: isLocked, minimap: { enabled: false }, fontSize: 13, automaticLayout: true }}
               />
            </div>
         </div>

         {/* Console */}
         <div className="h-[240px] bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col shrink-0">
            <div className="h-9 border-b border-zinc-800 flex items-center justify-between px-2 bg-zinc-950/50">
               <div className="flex gap-1">
                  {/* Console Tabs */}
                  <button onClick={() => updateSolution({ consoleView: 'testcases' })} className={cn("px-3 py-1 text-xs border-b-2", consoleView === 'testcases' ? "text-white border-blue-500" : "text-zinc-500 border-transparent")}>Test Cases</button>
                  <button onClick={() => updateSolution({ consoleView: 'result' })} className={cn("px-3 py-1 text-xs border-b-2", consoleView === 'result' ? "text-white border-green-500" : "text-zinc-500 border-transparent")}>Result</button>
               </div>
               <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => executeCode(false)} disabled={isRunning || isSubmitting} className="h-6 text-xs bg-zinc-800"><Play className="w-3 h-3 mr-1"/> Run</Button>
                  <Button size="sm" onClick={() => executeCode(true)} disabled={isSubmitting || isRunning} className="h-6 text-xs bg-green-700 hover:bg-green-600 text-white"><Send className="w-3 h-3 mr-1"/> Submit</Button>
               </div>
            </div>
            {/* Console Content: Use your existing rendering logic here, referencing `runResult`, `currentProblem`, etc. */}
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar font-mono text-xs bg-zinc-900">
               {consoleView === 'result' && runResult && (
                  <div>
                     <div className={cn("text-lg font-bold mb-2", runResult.status === 'Accepted' ? "text-green-500" : "text-red-500")}>{runResult.status}</div>
                     {/* ... Add your full result rendering here ... */}
                  </div>
               )}
               {consoleView === 'testcases' && (
                  <div className="text-zinc-400">
                     Input: {currentProblem.examples?.[0]?.input} <br/>
                     Expected: {currentProblem.examples?.[0]?.output}
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};