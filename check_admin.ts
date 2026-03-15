import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Fetching exam_sessions and github_submissions...');

    const { data: sessions } = await supabase.from('exam_sessions').select('id, user_id, email').limit(5);
    console.log('Exam Sessions:', sessions);

    const { data: github } = await supabase.from('github_submissions').select('*').limit(5);
    console.log('Github Submissions:', github);

    // Let's also check if any github_submissions map to a session id vs user_id
    if (sessions && github) {
        for (const g of github) {
            let matchUser = sessions.find(s => s.user_id === g.user_id);
            let matchSession = sessions.find(s => s.id === g.user_id);
            if (matchUser) console.log(`[MATCH on user_id] Github user_id ${g.user_id} = Session user_id for ${matchUser.email}`);
            if (matchSession) console.log(`[MATCH on session id] Github user_id ${g.user_id} = Session id for ${matchSession.email}`);
        }
    }
}

check();
