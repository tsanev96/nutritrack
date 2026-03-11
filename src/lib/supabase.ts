import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This creates a single Supabase client to be reused across the whole app.
// The anon key is safe to expose in the browser — Supabase uses Row Level Security
// (RLS) to ensure users can only ever read/write their own data.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
