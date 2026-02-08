declare const Deno: any;
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

//  2. Use Deno.serve instead of serve()
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("🚀 Grading with Groq Started");

    // 1. Check Secrets
    const groqKey = Deno.env.get('GROQ_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!groqKey) throw new Error("CRITICAL: GROQ_API_KEY is missing!");
    if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing!");

    const { submission_id } = await req.json();
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Fetch Submission Data
    const { data: record, error: fetchError } = await supabase
      .from('flowchart_submissions')
      .select('*, flowchart_problems(title, description, requirements)')
      .eq('id', submission_id)
      .single();

    if (fetchError || !record) throw new Error(`DB Error: ${fetchError?.message}`);

    // 3. Prepare Data for AI
    const nodes = record.nodes || [];
    const edges = record.edges || [];

    // Robust mapping for nodes/edges
    const simpleNodes = nodes.map((n: any) => ({
      id: n.id,
      type: n.type,
      text: n.data?.label || n.data?.text || n.label || `[${n.type} Node]`
    }));

    const simpleEdges = edges.map((e: any) => ({
      from: e.source,
      to: e.target,
      label: e.label || "connects to"
    }));

    const prompt = `
      You are a Computer Science Professor grading a flowchart.
      
      PROBLEM:
      Title: "${record.flowchart_problems?.title}"
      Description: ${record.flowchart_problems?.description}
      Requirements: ${JSON.stringify(record.flowchart_problems?.requirements)}

      STUDENT SUBMISSION:
      Nodes: ${JSON.stringify(simpleNodes)}
      Connections: ${JSON.stringify(simpleEdges)}

      GRADING RUBRIC:
      1. Logic Flow (40%): Does the start lead to end? Are steps logical?
      2. Requirements (40%): Did they meet the specific requirements listed above?
      3. Syntax (20%): Are Decision nodes used for branching (Yes/No)?

      INSTRUCTIONS:
      - If the flowchart makes sense but has minor errors, give partial credit (e.g., 60-80).
      - Only give 0 if the flowchart is empty or completely irrelevant.
      - "Start" and "End" nodes are standard. Focus on the logic between them.

      OUTPUT FORMAT (JSON ONLY):
      {
        "reasoning": "Explain your thinking here in 1 sentence.",
        "score": number, 
        "feedback": "A short, constructive feedback string for the student." 
      }
    `;

    // 4. Call Groq API
    console.log("⚡ Calling Groq Llama 3...");

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful grading assistant. You ALWAYS output valid JSON. You never output markdown.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      throw new Error(`Groq API Error: ${errText}`);
    }

    const aiData = await groqResponse.json();
    const content = aiData.choices[0].message.content;

    let result;
    try {
      result = JSON.parse(content);
    } catch (e) {
      console.error("JSON Parse Error:", content);
      throw new Error("AI returned invalid JSON");
    }

    console.log("✅ Final Grade:", result);

    const finalScore = Math.round(result.score || 0);

    // 5. Update Database
    const { error: updateError } = await supabase
      .from('flowchart_submissions')
      .update({
        ai_score: finalScore,
        ai_feedback: result.feedback || "Evaluated.",
        status: 'graded'
      })
      .eq('id', submission_id);

    if (updateError) throw new Error("DB Update Failed: " + updateError.message);

    // Update Leaderboard
    const { data: lb } = await supabase.from('leaderboard').select('*').eq('user_id', record.user_id).single();
    if (lb) {
      const r1 = lb.round1_score || 0;
      const r3 = lb.round3_score || 0;
      await supabase.from('leaderboard').upsert({
        user_id: record.user_id,
        round2_score: finalScore,
        overall_score: r1 + finalScore + r3,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("🔥 Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});