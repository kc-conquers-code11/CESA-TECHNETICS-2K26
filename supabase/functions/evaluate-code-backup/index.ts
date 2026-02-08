declare const Deno: any;
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req : any ) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    console.log("🚀 Backup AI Judge Started");

    const groqKey = Deno.env.get('GROQ_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!groqKey) throw new Error("Missing GROQ_API_KEY");

    const { submission_id } = await req.json();
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch User Submission
    const { data: submission, error: fetchError } = await supabase
      .from('coding_submissions')
      .select('*')
      .eq('id', submission_id)
      .single();

    if (fetchError || !submission) throw new Error("Submission not found in DB");

    const problemSet = submission.problem_set || [];
    if (problemSet.length === 0) throw new Error("No problems found in submission");

    // 2. Fetch Problem Details (Description, Constraints) for Context
    const problemIds = problemSet.map((p: any) => p.problem_id);
    const { data: problemsDetails } = await supabase
        .from('coding_problems')
        .select('*')
        .in('id', problemIds);

    // 3. Evaluate Each Problem
    let totalScore = 0;
    const evaluatedSet = [];

    for (const item of problemSet) {
        const details = problemsDetails?.find((d: any) => d.id === item.problem_id);
        if (!details) {
            evaluatedSet.push(item); 
            continue;
        }

        // Construct AI Prompt
        const prompt = `
          Act as a strict Code Judge. Evaluate this solution.
          
          PROBLEM: "${details.title}"
          ${details.description}
          Constraints: ${JSON.stringify(details.constraints)}
          
          USER CODE (${item.language}):
          ${item.code}

          TASK:
          1. Logic Check: Does it solve the problem?
          2. Complexity: Is it optimal?
          3. Score: Assign 0-100.

          OUTPUT JSON ONLY:
          {
            "score": number,
            "complexity": "string (e.g. O(n))",
            "feedback": "string (1 line)",
            "passed": boolean
          }
        `;

        // Call Groq
        try {
            const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'Output valid JSON only. No markdown.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.1,
                    response_format: { type: "json_object" }
                }),
            });

            const aiData = await aiRes.json();
            const result = JSON.parse(aiData.choices[0].message.content);

            totalScore += result.score;
            
            // Append AI results to the item
            evaluatedSet.push({
                ...item,
                status: 'completed',
                ai_result: result
            });

        } catch (err) {
            console.error("AI Error for problem:", item.problem_id, err);
            evaluatedSet.push(item); // Keep original if failed
        }
    }

    // 4. Calculate Final Stats
    const finalScore = Math.round(totalScore / Math.max(1, problemSet.length));

    // 5. Update Database
    const { error: updateError } = await supabase
        .from('coding_submissions')
        .update({
            problem_set: evaluatedSet,
            total_score: finalScore,
            status: 'completed',
            updated_at: new Date().toISOString()
        })
        .eq('id', submission_id);

    if (updateError) throw new Error("Failed to save evaluation");

    // 6. Update Leaderboard
    const { data: lb } = await supabase.from('leaderboard').select('*').eq('user_id', submission.user_id).single();
    if (lb) {
        const r1 = lb.round1_score || 0;
        const r2 = lb.round2_score || 0;
        await supabase.from('leaderboard').upsert({
            user_id: submission.user_id,
            round3_score: finalScore,
            overall_score: r1 + r2 + finalScore,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
    }

    // Return summarized result for the Client UI
    const summary = {
        score: finalScore,
        complexity: evaluatedSet.map(e => e.ai_result?.complexity || "N/A").join(", "),
        feedback: evaluatedSet.map(e => e.ai_result?.feedback || "Evaluated").join(" | "),
        test_cases_passed: evaluatedSet.filter(e => e.ai_result?.passed).length
    };

    return new Response(JSON.stringify(summary), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error("🔥 Critical Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 });
  }
});