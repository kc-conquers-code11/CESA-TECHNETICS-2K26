import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: session } = await supabase.from('exam_sessions').select('*').eq('user_id', '5cb5a318-4b8f-40b4-b3e3-48440a200c41');
    console.log('Session matching test submission user_id:', session);

    const { data: sessionByName } = await supabase.from('exam_sessions').select('*').ilike('team_name', '%test%');
    console.log('Session matching team name test:', sessionByName);
}

check();
