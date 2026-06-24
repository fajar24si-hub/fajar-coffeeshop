// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Fallback ke hardcoded values jika env vars tidak tersedia saat build
const FALLBACK_URL = "https://nfgevujfxebfjqdcbgkc.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZ2V2dWpmeGViZmpxZGNiZ2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNDQ5MDMsImV4cCI6MjA5NzYyMDkwM30._hacsfyE4eIPsHcHC1cKq_8AflMdk_TcShLQcbFK1Ss";

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

