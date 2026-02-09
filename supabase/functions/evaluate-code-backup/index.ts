// @ts-ignore
declare const Deno : any;
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    console.log("🚀 Backup AI Judge Started");

    const groqKey = Deno.env.get('GROQ_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!groqKey || !supabaseUrl || !supabaseKey) {
      throw new Error("Missing API Keys");
    }

    const { submission_id } = await req.json();
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch User Submission
    const { data: submission, error: fetchError } = await supabase
      .from('coding_submissions')
      .select('*')
      .eq('id', submission_id)
      .single();

    if (fetchError || !submission) throw new Error("Submission not found in DB");

    // Check if problem_set exists
    const problemSet = Array.isArray(submission.problem_set) ? submission.problem_set : [];
    
    if (problemSet.length === 0) {
        await supabase.from('coding_submissions').update({
            status: 'completed',
            total_score: 0,
            updated_at: new Date().toISOString()
        }).eq('id', submission_id);
        
        return new Response(JSON.stringify({ message: "Empty submission processed" }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }

    // 2. Fetch Problem Details from DB
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
        
        // Skip if no code provided or problem not found
        if (!details || !item.code || item.code.trim().length === 0) {
            evaluatedSet.push({ 
                ...item, 
                status: 'error', 
                ai_result: { score: 0, feedback: "No code provided or problem not found.", passed: false } 
            });
            continue;
        }

        // Construct AI Prompt (FIXED: Added Code Fences)
        const prompt = `
          Act as a strict Code Judge. Evaluate this solution.
          
          PROBLEM: "${details.title}"
          ${details.description}
          
          Constraints: ${JSON.stringify(details.constraints || [])}
          Test Cases (Expected Behavior): ${JSON.stringify(details.test_cases || [])}
          
          USER CODE (${item.language || 'unknown'}):
          \`\`\`${item.language || ''}
          ${item.code}
          \`\`\`

          TASK:
          1. Logic Check: Does it solve the problem correctly according to the description?
          2. Edge Cases: Does it handle constraints?
          3. Complexity: Is it reasonably optimal?
          4. Score: Assign a score from 0 to 100. Be strict. If code is empty or nonsense, score 0.

          OUTPUT JSON ONLY (Do not write anything else):
          {
            "score": number,
            "complexity": "string (e.g. O(n))",
            "feedback": "string (short constructive feedback)",
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
            const content = aiData.choices?.[0]?.message?.content;
            
            if (!content) throw new Error("Empty response from AI");

            const result = JSON.parse(content);

            totalScore += (result.score || 0);
            
            evaluatedSet.push({
                ...item,
                status: 'completed',
                ai_result: result
            });

        } catch (err) {
            console.error("AI Error for problem:", item.problem_id, err);
            // Fallback for failed evaluation
            evaluatedSet.push({ 
                ...item, 
                status: 'error', 
                ai_result: { score: 0, feedback: "AI Evaluation Failed", passed: false } 
            });
        }
    }

    // 4. Calculate Final Stats
    const finalScore = Math.round(totalScore / Math.max(1, problemSet.length));

    // 5. Update Database (Coding Submissions)
    const { error: updateError } = await supabase
        .from('coding_submissions')
        .update({
            problem_set: evaluatedSet,
            total_score: finalScore, 
            status: 'completed',
            updated_at: new Date().toISOString()
        })
        .eq('id', submission_id);

    if (updateError) {
        console.error("DB Update Error:", updateError);
        throw new Error("Failed to save evaluation to DB");
    }

    // Return Result
    const summary = {
        score: finalScore,
        complexity: evaluatedSet.map(e => e.ai_result?.complexity || "N/A").join(", "),
        feedback: evaluatedSet.map(e => e.ai_result?.feedback || "Evaluated").join(" | "),
        test_cases_passed: evaluatedSet.filter(e => e.ai_result?.passed).length
    };

    return new Response(JSON.stringify(summary), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error("🔥 Critical Edge Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 });
  }
});