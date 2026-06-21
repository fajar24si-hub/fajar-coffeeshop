// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // profil dari tabel users
  const [session, setSession] = useState(null);   // sesi Supabase Auth
  const [loading, setLoading] = useState(true);

  // ── Saat app pertama dibuka: ambil sesi yang sudah ada ───────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) await fetchProfile(session.user.id);
      setLoading(false);
    });

    // Dengarkan perubahan auth (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Ambil profil user dari tabel users ───────────────────────
  async function fetchProfile(uid) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", uid)
      .single();

    if (!error && data) {
      setUser(data);
      // Update localStorage untuk komponen yang masih membaca dari sana
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("authToken", session?.access_token ?? "supabase-session");
    }
  }

  // ── Login ─────────────────────────────────────────────────────
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  // ── Register ──────────────────────────────────────────────────
  async function register(name, email, password, phone = "") {
    // 1. Buat akun di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (authError) throw authError;

    // 2. Simpan profil ke tabel users
    if (authData.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        name,
        email,
        phone,
        role: "customer",
        tier: "Bronze",
        points: 0,
        visits: 0,
        spent: 0,
        joined: new Date().toISOString().split("T")[0],
      });
      if (profileError) throw profileError;
    }

    return authData;
  }

  // ── Logout ────────────────────────────────────────────────────
  async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    setUser(null);
    setSession(null);
  }

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    refreshProfile: () => session && fetchProfile(session.user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
