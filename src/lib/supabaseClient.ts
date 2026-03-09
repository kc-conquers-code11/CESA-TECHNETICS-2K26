import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const fallbackUrl = 'https://example.supabase.co';
const fallbackAnonKey = 'public-anon-key-not-configured';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        '[Supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Add them to .env.local to enable auth + DB.'
    );
}

export const supabase = createClient(supabaseUrl ?? fallbackUrl, supabaseAnonKey ?? fallbackAnonKey);
