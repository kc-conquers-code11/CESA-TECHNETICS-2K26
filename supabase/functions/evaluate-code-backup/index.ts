declare const Deno: any;
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req : any) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    try {
        console.log("⚠️ Primary Judge Failed. Initiating AI Backup Protocol...");

        const groqKey = Deno.env.get('GROQ_API_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!groqKey || !supabaseUrl || !supabaseKey) throw new Error("Missing Credentials");

        const { submission_id } = await req.json();
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Fetch Code & Problem
        const { data: submission, error: fetchError } = await supabase
            .from('coding_submissions')
            .select('*, coding_problems(*)')
            .eq('id', submission_id)
            .single();

        if (fetchError || !submission) throw new Error("Submission not found");

        const problem = submission.coding_problems;
        const userCode = submission.code;
        const language = submission.language;

        // 2. AI Judge Prompt
        const prompt = `
      You are an Emergency Backup Code Judge. The primary compiler is down.
      Your task is to STATICALLY ANALYZE and SIMULATE the execution of the following code.

      PROBLEM: "${problem.title}"
      ${problem.description}
      Constraints: ${JSON.stringify(problem.constraints)}
      Test Cases: ${JSON.stringify(problem.examples)}

      USER CODE (${language}):
      ${userCode}

      TASK:
      1. Logic Verification: Does the code solve the problem correctly?
      2. Complexity Analysis: Estimate Time & Space Complexity.
      3. Dry Run: Mentally run the provided examples. Do they pass?
      4. Runtime Prediction: Estimate execution time based on complexity (e.g., "45ms").

      OUTPUT JSON ONLY:
      {
        "test_cases_passed": number (integer count of passed examples),
        "total_test_cases": number (total examples count),
        "score": number (0-100 based on logic correctness),
        "runtime_prediction": "string",
        "complexity": "string",
        "feedback": "string (1 line critical feedback)"
      }
    `;

        // 3. Call Groq (Llama 3)
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are a strict code judge API. Output JSON only.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1,
                response_format: { type: "json_object" }
            }),
        });

        if (!groqResponse.ok) throw new Error("AI Judge Unresponsive");

        const aiData = await groqResponse.json();
        const result = JSON.parse(aiData.choices[0].message.content);

        console.log(" AI Judge Verdict:", result);

        // 4. Update Database
        await supabase.from('coding_submissions').update({
            test_cases_passed: result.test_cases_passed,
            score: result.score,
            status: 'completed', // Mark done
            ai_performance_metrics: {
                runtime: result.runtime_prediction,
                complexity: result.complexity,
                judge_type: 'ai_backup' // Mark that this was graded by AI
            }
        }).eq('id', submission_id);

        // Update Leaderboard
        const { data: lb } = await supabase.from('leaderboard').select('*').eq('user_id', submission.user_id).single();
        if (lb) {
            const r1 = lb.round1_score || 0;
            const r2 = lb.round2_score || 0;
            await supabase.from('leaderboard').upsert({
                user_id: submission.user_id,
                round3_score: result.score,
                overall_score: r1 + r2 + result.score,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
        }

        return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error("Backup Failed:", error);
        return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 });
    }
});