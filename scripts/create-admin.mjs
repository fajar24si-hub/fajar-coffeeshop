// scripts/create-admin.mjs
// Jalankan sekali: node scripts/create-admin.mjs
// Pastikan sudah disable "Email Confirmation" di Supabase Auth Settings

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL     = "https://nfgevujfxebfjqdcbgkc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZ2V2dWpmeGViZmpxZGNiZ2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNDQ5MDMsImV4cCI6MjA5NzYyMDkwM30._hacsfyE4eIPsHcHC1cKq_8AflMdk_TcShLQcbFK1Ss";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdmin() {
  console.log("🚀 Membuat akun admin...\n");

  // 1. Daftar via Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: "admin@gmail.com",
    password: "admin123",
    options: { data: { name: "Admin Brewista" } },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      console.log("ℹ️  Email admin@gmail.com sudah terdaftar di Auth.");
      console.log("   Coba login langsung di http://localhost:5173/login");
    } else {
      console.error("❌ Error Auth:", error.message);
    }
    return;
  }

  const uid = data.user?.id;
  if (!uid) {
    console.error("❌ User ID tidak ditemukan.");
    return;
  }

  console.log("✅ Auth user dibuat:", uid);

  // 2. Insert profil ke tabel users
  const { error: profileError } = await supabase.from("users").insert({
    id:      uid,
    name:    "Admin Brewista",
    email:   "admin@gmail.com",
    phone:   "0812-0000-0001",
    role:    "admin",
    tier:    "Gold",
    points:  5000,
    visits:  0,
    spent:   0,
    joined:  new Date().toISOString().split("T")[0],
  });

  if (profileError) {
    console.error("❌ Error insert profil:", profileError.message);
    console.log("\n💡 Coba jalankan SQL ini di Supabase SQL Editor:");
    console.log(`
INSERT INTO users (id, name, email, phone, role, tier, points, visits, spent, joined)
VALUES (
  '${uid}',
  'Admin Brewista',
  'admin@email.com',
  '0812-0000-0001',
  'admin',
  'Gold',
  5000,
  0,
  0,
  CURRENT_DATE
);
    `);
  } else {
    console.log("✅ Profil admin berhasil dibuat!\n");
    console.log("═══════════════════════════════");
    console.log("  📧 Email    : admin@gmail.com");
    console.log("  🔑 Password : admin123");
    console.log("  👑 Role     : admin");
    console.log("═══════════════════════════════");
    console.log("\n🌐 Login di: http://localhost:5173/login");
  }
}

createAdmin().catch(console.error);
