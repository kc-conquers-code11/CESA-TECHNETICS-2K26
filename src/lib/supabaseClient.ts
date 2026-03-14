import { createClient } from '@supabase/supabase-js';

// .env.local file mein ye variables daalna
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Prevent a hard crash (blank screen) when env vars are missing.
// The app will still render, but Supabase calls will fail until configured.
const fallbackUrl = 'https://example.supabase.co';
const fallbackAnonKey = 'public-anon-key-not-configured';

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    '[Supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Add them to .env.local to enable auth + DB.'
  );
}

export const supabase = createClient(supabaseUrl ?? fallbackUrl, supabaseAnonKey ?? fallbackAnonKey);