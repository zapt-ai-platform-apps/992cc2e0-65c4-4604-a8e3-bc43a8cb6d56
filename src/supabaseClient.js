import { createClient } from '@supabase/supabase-js';
import { initializeZapt } from '@zapt/zapt-js';

export const { createEvent, supabase } = initializeZapt(import.meta.env.VITE_PUBLIC_APP_ID);

export const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);