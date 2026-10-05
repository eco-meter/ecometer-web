import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing VITE_SUPABASE_URL. Check your .env file and restart the dev server.",
  );
}

if (!supabaseKey) {
  throw new Error(
    "Missing VITE_SUPABASE_PUBLISHABLE_KEY. Check your .env file and restart the dev server.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
