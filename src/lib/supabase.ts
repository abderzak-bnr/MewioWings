import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pdjklzzxketldcwiywwo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fbWK_m98yEfY7VwakFWZ2A_iLLGBZoA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
