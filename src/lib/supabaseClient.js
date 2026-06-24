// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "[Supabase] ❌ VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY tidak ditemukan.\n" +
    "Pastikan sudah diset di Vercel → Settings → Environment Variables"
  );
}

if (supabaseAnonKey && supabaseAnonKey.startsWith("sb_publishable_")) {
  console.error(
    "[Supabase] ❌ Key yang digunakan adalah 'Publishable Key', BUKAN 'anon key'.\n" +
    "Ambil anon key dari: Supabase → Project Settings → API → Project API Keys → anon public"
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient("https://placeholder.supabase.co", "placeholder-key");

