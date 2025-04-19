import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
// Debugging: ensure environment variables are loaded
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables missing:', {
    REACT_APP_SUPABASE_URL: supabaseUrl,
    REACT_APP_SUPABASE_ANON_KEY: !!supabaseKey
  });
}
export const supabase = createClient(supabaseUrl, supabaseKey);
