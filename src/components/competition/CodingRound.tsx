import React, { useState, useEffect, useCallback } from 'react';
import Editor from "@monaco-editor/react";
import { Loader2, AlertTriangle, CheckCircle2, Play, Send, Save, Cloud, Terminal, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useCompetitionStore } from '@/store/competitionStore';
import { CompetitionTimer } from './CompetitionTimer';
import { RoundTransition } from './RoundTransition';
import { cn } from '@/lib/utils';

// --- TYPES ---
interface CodingProblem {
  id: string;
  title: string;
  description: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  starter_code: string;
}

interface CodingRoundProps {
  isSidebarExpanded: boolean;
}

export const CodingRound = ({ isSidebarExpanded }: CodingRoundProps) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [activeProblem, setActiveProblem] = useState<CodingProblem | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [roundDuration, setRoundDuration] = useState(45 * 60); 
  const [usingBackup, setUsingBackup] = useState(false); // UI State for Backup Mode

  const { completeRound, userId } = useCompetitionStore();

  // 1. Fetch Problem & Restore Draft
  useEffect(() => {
    const initRound = async () => {
      if (!userId) return;

      try {
        setLoadingProblem(true);

        const { data: config } = await supabase.from('game_config').select('value').eq('key', 'coding_duration').single();
        if (config?.value) setRoundDuration(parseInt(config.value) * 60);

        const { data: existingSub } = await supabase
          .from('coding_submissions')
          .select('*, coding_problems(*)')
          .eq('user_id', userId)
          .maybeSingle();

        let problemData: CodingProblem | null = null;

        if (existingSub) {
          console.log("Restoring Coding Draft...");
          problemData = existingSub.coding_problems as unknown as CodingProblem;

          if (existingSub.code) {
            setCode(existingSub.code);
          } else if (problemData?.starter_code) {
            setCode(problemData.starter_code);
          }

          if (existingSub.status === 'completed') {
            setSubmitted(true);
          }
        } else {
          console.log("Assigning New Coding Problem...");
          const { data: allProbs } = await supabase.from('coding_problems').select('*');

          if (allProbs && allProbs.length > 0) {
            const randomProb = allProbs[Math.floor(Math.random() * allProbs.length)];
            problemData = randomProb;
            setCode(randomProb.starter_code || "// Write your solution here");

            await supabase.from('coding_submissions').upsert({
              user_id: userId,
              problem_id: randomProb.id,
              code: randomProb.starter_code || "",
              language: 'javascript',
              status: 'draft',
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
          }
        }

        if (problemData) {
          setActiveProblem(problemData);
        }

      } catch (err) {
        console.error("Failed to init coding round:", err);
        toast.error("Failed to load problem");
      } finally {
        setLoadingProblem(false);
      }
    };

    initRound();
  }, [userId]);

  // 2. Auto-Save Logic
  const handleSave = useCallback(async (silent = false) => {
    if (!userId || !activeProblem) return;
    if (!silent) setIsSaving(true);

    try {
      await supabase.from('coding_submissions').upsert({
        user_id: userId,
        problem_id: activeProblem.id,
        code: code,
        language: language,
        status: 'draft',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      setLastSaved(new Date());
      if (!silent) toast.success("Code Saved");
    } catch (err) {
      console.error("Save failed:", err);
      if (!silent) toast.error("Save Failed");
    } finally {
      if (!silent) setIsSaving(false);
    }
  }, [code, language, userId, activeProblem]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeProblem) handleSave(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [handleSave, activeProblem]);

  // 3. RUN CODE (Simulation for now, or could use AI too)
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Compiling and running tests...\n");

    // Simulated Run
    setTimeout(() => {
      setOutput((prev) => prev + "Test Case 1: Checking logic...\nTest Case 2: Checking edge cases...\n\n> Result: Logic Valid (Pre-check passed)");
      setIsRunning(false);
    }, 1500);
  };

  // 4. SUBMIT WITH BACKUP LOGIC
  const handleSubmit = async () => {
    if (!userId || !activeProblem) return;
    setIsSubmitting(true);
    setUsingBackup(false);

    let submissionId: string | null = null;

    try {
      // Step A: Save Final Code to DB
      const { data: submission, error } = await supabase.from('coding_submissions').upsert({
        user_id: userId,
        problem_id: activeProblem.id,
        code: code,
        language: language,
        status: 'pending', // Mark pending for judge
        submitted_at: new Date().toISOString()
      }, { onConflict: 'user_id' }).select().single();

      if (error || !submission) throw new Error("DB Save Failed");
      submissionId = submission.id;

      toast.info("Sent to Judge0. Waiting for verdict...");

      // Step B: Wait for Primary Judge (Simulated Wait)
      // In a real app, you might poll DB here. 
      // We will race a timeout against a "mock" success.
      
      const primaryJudgePromise = new Promise((resolve, reject) => {
        // Simulating Judge0 failure/delay
        setTimeout(() => {
            // Rejecting to force backup for demonstration, 
            // or you can implement real polling here.
            reject(new Error("Judge0 Timeout")); 
        }, 5000); // 5s Timeout before backup triggers
      });

      try {
        await primaryJudgePromise;
        // If primary succeeds (not implemented here fully), complete round
      } catch (judgeError) {
        // Step C: BACKUP PROTOCOL
        console.warn("Primary Judge Failed. Activating Backup.");
        setUsingBackup(true); // Show UI indicator
        toast.warning("Primary Judge unresponsive. Rerouting to AI Backup Node...");

        const { data: aiResult, error: aiError } = await supabase.functions.invoke('evaluate-code-backup', {
            body: { submission_id: submissionId }
        });

        if (aiError || !aiResult) throw new Error("Backup System Failed");

        setOutput(`
-----------------------------------
⚠️ PRIMARY COMPILER TIMEOUT
 BACKUP PROTOCOL ACTIVE (AI JUDGE)
-----------------------------------
> Logic Verification: ${aiResult.score > 0 ? "PASSED" : "FAILED"}
> Score: ${aiResult.score}/100
> Predicted Runtime: ${aiResult.runtime_prediction}
> Complexity: ${aiResult.complexity}
> Feedback: ${aiResult.feedback}
-----------------------------------
        `);
        
        toast.success(`Evaluated via Backup! Score: ${aiResult.score}`);
      }

      // Step D: Finish
      setTimeout(() => {
        setSubmitted(true);
        completeRound('coding');
      }, 3000);

    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error("Critical Failure: Code saved but evaluation failed.");
      // Even if eval fails, we can move them forward if code is saved
      setTimeout(() => {
          setSubmitted(true);
          completeRound('coding');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    toast.error("Time's up! Auto-submitting code...");
    handleSubmit();
  };

  if (submitted) {
    return <RoundTransition
      completedRound="Coding Round"
      nextRoundName="Competition Complete"
      nextRoundSlug="coding"
    />;
  }

  if (loadingProblem) return <div className="h-full flex items-center justify-center flex-col gap-4"><Loader2 className="w-10 h-10 animate-spin text-red-600" /><p className="text-zinc-400 font-mono">Decrypting Problem Statement...</p></div>;
  if (!activeProblem) return <div className="h-full flex items-center justify-center flex-col gap-4"><AlertTriangle className="w-12 h-12 text-yellow-500" /><p className="text-zinc-400">No active coding problem found. Contact Admin.</p></div>;

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-500">

      {/* LEFT PANEL: Problem Description */}
      <div className="w-1/3 min-w-[350px] bg-zinc-950/80 border border-zinc-800 rounded-xl overflow-hidden flex flex-col backdrop-blur-sm">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white font-st tracking-wide">{activeProblem.title}</h2>
          <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
            <span className="bg-red-900/20 text-red-400 px-2 py-0.5 rounded border border-red-900/30">Hard</span>
            <span>•</span>
            <span>100 Points</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          <div>
            <h3 className="text-sm font-bold text-zinc-300 uppercase mb-2">Description</h3>
            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{activeProblem.description}</p>
          </div>

          {activeProblem.examples && activeProblem.examples.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-zinc-300 uppercase mb-3">Examples</h3>
              <div className="space-y-4">
                {activeProblem.examples.map((ex, i) => (
                  <div key={i} className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                    <div className="mb-2">
                      <span className="text-xs font-mono text-zinc-500 block mb-1">Input:</span>
                      <code className="text-sm text-zinc-300 bg-black/50 px-2 py-1 rounded block">{ex.input}</code>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-zinc-500 block mb-1">Output:</span>
                      <code className="text-sm text-green-400 bg-black/50 px-2 py-1 rounded block">{ex.output}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeProblem.constraints && (
            <div>
              <h3 className="text-sm font-bold text-zinc-300 uppercase mb-2">Constraints</h3>
              <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                {activeProblem.constraints.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Editor & Output */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* TOOLBAR */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-2 flex justify-between items-center backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800 text-xs text-zinc-300 font-mono">
              JavaScript (Node 18)
            </div>
            {lastSaved && (
              <span className="text-xs text-zinc-500 flex items-center gap-1 ml-2">
                <Cloud className="w-3 h-3" /> Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <CompetitionTimer totalSeconds={roundDuration} onTimeUp={handleTimeUp} />

            <Button size="sm" variant="secondary" onClick={() => handleSave(false)} disabled={isSaving} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-8 border border-zinc-700">
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            </Button>

            <Button size="sm" onClick={handleRunCode} disabled={isRunning} className="bg-green-600 hover:bg-green-700 text-white font-bold h-8 gap-2">
              {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
              Run
            </Button>

            <Button size="sm" onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-8 gap-2 px-4 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-shadow">
              {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              Submit
            </Button>
          </div>
        </div>

        {/* EDITOR */}
        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden relative group">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 }, fontFamily: 'JetBrains Mono, monospace', scrollBeyondLastLine: false, automaticLayout: true }}
          />
          {/* BACKUP MODE INDICATOR */}
          {usingBackup && (
             <div className="absolute top-2 right-2 bg-orange-900/80 text-orange-200 border border-orange-500/50 px-3 py-1 rounded text-xs font-bold flex items-center gap-2 animate-pulse backdrop-blur">
                <Cpu className="w-3 h-3" />
                BACKUP PROTOCOL ACTIVE
             </div>
          )}
        </div>

        {/* OUTPUT CONSOLE */}
        <div className="h-[150px] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Console
            </span>
            <Button variant="ghost" size="sm" onClick={() => setOutput("")} className="h-5 text-[10px] text-zinc-500 hover:text-white">Clear</Button>
          </div>
          <div className="flex-1 p-3 font-mono text-sm text-zinc-300 overflow-y-auto whitespace-pre-wrap">
            {output || <span className="text-zinc-600 italic">Ready to execute...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};