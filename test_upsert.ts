import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Testing an upsert into github_submissions to see if it throws an error over unique constraint:');

    const { data, error } = await supabase
        .from('github_submissions')
        .upsert({
            team_name: 'test_upsert',
            deploy_link: 'http://test.com',
            user_id: '5cb5a318-4b8f-40b4-b3e3-48440a200c41' // Just a dummy ID from before
        }, { onConflict: 'user_id' });

    if (error) {
        console.error('UPSERT ERROR:', error.message, error.details, error.hint);
    } else {
        console.log('Upsert succeeded!', data);
        // Cleanup
        await supabase.from('github_submissions').delete().eq('team_name', 'test_upsert');
    }
}

check();
