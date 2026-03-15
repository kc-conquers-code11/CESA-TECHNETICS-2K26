import { createClient } from '@supabase/supabase-js';

// We need the supabase URL and KEY from the environment or .env
// We can just use node and dotenv

import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Fetching github_submissions...');
    const { data, error } = await supabase.from('github_submissions').select('*').limit(5);
    console.log('Data:', data);
    if (error) {
        console.error('Error:', error);
    }
}

check();
