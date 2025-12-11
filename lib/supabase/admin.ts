// /servers/admin.ts

import { createClient } from "@supabase/supabase-js";

// Ambil variabel dari lingkungan server (tanpa NEXT_PUBLIC)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL; // URL tetap OK dengan NEXT_PUBLIC
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // throw new Error("Missing Supabase Service Role Key or URL."); // Lebih baik throw error di sini
  console.error("Missing Service Role Key or URL for Admin Client!");
}

// Inisialisasi client admin (jika Anda menggunakan file ini, pastikan ia di-import di server)
const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

export default supabaseAdmin;
