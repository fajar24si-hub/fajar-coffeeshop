-- ================================================================
-- FIX: Auto-create user profile via trigger (bypass RLS)
-- Jalankan seluruh script ini di Supabase SQL Editor
-- ================================================================

-- LANGKAH 1: Hapus policy lama yang bermasalah (jika ada)
DROP POLICY IF EXISTS "Admin full access"         ON users;
DROP POLICY IF EXISTS "Users can read own data"   ON users;
DROP POLICY IF EXISTS "Allow insert on signup"    ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Authenticated can read all" ON users;
DROP POLICY IF EXISTS "Insert own profile"        ON users;
DROP POLICY IF EXISTS "Update own or admin"       ON users;
DROP POLICY IF EXISTS "Delete own or admin"       ON users;

-- LANGKAH 2: Buat function is_admin (SECURITY DEFINER agar bypass RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Revoke akses publik, hanya authenticated yang boleh pakai
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- LANGKAH 3: Buat trigger function untuk auto-create profil user
-- Function ini berjalan sebagai SECURITY DEFINER sehingga bypass RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, email, phone, role, tier, points, visits, spent, joined)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer',
    'Bronze',
    0,
    0,
    0,
    CURRENT_DATE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- LANGKAH 4: Buat trigger pada auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- LANGKAH 5: Buat RLS policies baru yang benar
-- SELECT: semua user yang sudah login bisa baca data
CREATE POLICY "Authenticated can read all"
  ON users FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- INSERT: user yang sudah login bisa insert profilnya sendiri
-- (sebagai backup, trigger utama sudah handle ini)
CREATE POLICY "Insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: user bisa update profilnya sendiri, atau admin bisa update siapa saja
CREATE POLICY "Update own or admin"
  ON users FOR UPDATE
  USING (auth.uid() = id OR is_admin());

-- DELETE: hanya admin yang bisa hapus
CREATE POLICY "Delete own or admin"
  ON users FOR DELETE
  USING (auth.uid() = id OR is_admin());

-- Pastikan RLS aktif
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- SELESAI! ✅
