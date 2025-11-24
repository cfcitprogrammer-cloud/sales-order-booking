// src/supabase.js

import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase credentials
const SUPABASE_URL = "https://xzeptvyowhxovjljsbdx.supabase.co"; // Your Supabase project URL
const SUPABASE_ANON_KEY = "sb_publishable_DCsy6K3i3Lx12nF4xZfssQ_3keJCo3z"; // Your Supabase anon key

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
