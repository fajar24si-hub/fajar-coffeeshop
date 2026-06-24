-- ================================================================
-- FIX: Infinite Recursion pada RLS Policy tabel "users"
-- Jalankan seluruh script ini di Supabase SQL Editor
-- ================================================================

-- LANGKAH 1: Hapus semua policy lama yang bermasalah
DROP POLICY IF EXISTS "Admin full access"         ON users;
DROP POLICY IF EXISTS "Users can read own data"   ON users;
DROP POLICY IF EXISTS "Allow insert on signup"    ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- LANGKAH 2: Buat function SECURITY DEFINER
-- Function ini berjalan dengan hak superuser, TIDAK memicu RLS,
-- sehingga tidak ada rekursi saat mengecek role admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- LANGKAH 3: Buat policy baru yang TIDAK rekursif

-- SELECT: semua user yang sudah login bisa baca data
-- (tidak perlu cek role ke tabel users lagi)
CREATE POLICY "Authenticated can read all"
  ON users FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- INSERT: user hanya bisa insert profil miliknya sendiri
-- (cek auth.uid() = id, tidak ada query ke tabel users)
CREATE POLICY "Insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: user bisa update profilnya sendiri, atau admin bisa update siapa saja
CREATE POLICY "Update own or admin"
  ON users FOR UPDATE
  USING (auth.uid() = id OR is_admin());

-- DELETE: user bisa hapus profilnya sendiri, atau admin bisa hapus siapa saja
CREATE POLICY "Delete own or admin"
  ON users FOR DELETE
  USING (auth.uid() = id OR is_admin());
