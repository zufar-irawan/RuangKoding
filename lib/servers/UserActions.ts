"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function updateProfileContactInfo(
  userId: string,
  data: {
    email: string;
  },
) {
  const supabase = await createClient();

  // Cek jika profile exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single();

  if (!existingProfile) {
    return;
  }

  // Update profiles table
  const { error } = await supabase
    .from("profiles")
    .update({
      email: data.email,
    })
    .eq("id", userId);

  if (error) {
    throw new Error("Gagal mengupdate profiles: " + error.message);
  }
}

// Cek jika user udah pernah update selama 7 hari kebelakang
async function checkAuthUpdateLimit(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_auth_limit")
    .select("last_auth_updated_at")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error("Gagal memeriksa batas waktu update");
  }

  // Kalo gada data, insert
  if (!data) {
    return { canUpdate: true, isFirstTime: true };
  }

  // Cek jika udah 7 hari
  const lastUpdate = new Date(data.last_auth_updated_at);
  const now = new Date();
  const daysSinceLastUpdate = Math.floor(
    (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceLastUpdate < 7) {
    const daysRemaining = 7 - daysSinceLastUpdate;
    return {
      canUpdate: false,
      isFirstTime: false,
      daysRemaining,
      lastUpdate: data.last_auth_updated_at,
    };
  }

  return { canUpdate: true, isFirstTime: false };
}

// Update user_auth_limit
async function updateAuthLimit(userId: string, isFirstTime: boolean) {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Kalau pertama kali
  if (isFirstTime) {
    const { error } = await supabase.from("user_auth_limit").insert({
      user_id: userId,
      last_auth_updated_at: now,
    });

    if (error) {
      throw new Error("Gagal menyimpan data batas waktu update");
    }
  } else {
    // kalau sudah ada
    const { error } = await supabase
      .from("user_auth_limit")
      .update({ last_auth_updated_at: now })
      .eq("user_id", userId);

    if (error) {
      throw new Error("Gagal memperbarui data batas waktu update");
    }
  }
}

export async function updateUserEmail(newEmail: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "User tidak terautentikasi",
    };
  }

  if (newEmail === user.email) {
    return {
      success: false,
      error: "Email baru tidak boleh sama dengan email lama",
    };
  }

  try {
    // Cek kalo user bisa update dengan aturan 7 hari
    const limitCheck = await checkAuthUpdateLimit(user.id);

    if (!limitCheck.canUpdate) {
      return {
        success: false,
        error: `Anda sudah mengubah informasi autentikasi. Silakan tunggu ${limitCheck.daysRemaining} hari lagi untuk melakukan perubahan.`,
      };
    }

    const { error: emailError } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (emailError) {
      return {
        success: false,
        error: "Gagal mengupdate email: " + emailError.message,
      };
    }

    // Update auth limit record
    await updateAuthLimit(user.id, limitCheck.isFirstTime);

    // Update profiles table
    await updateProfileContactInfo(user.id, {
      email: newEmail,
    });

    revalidatePath("/protected/settings/account");

    return {
      success: true,
      message:
        "Email berhasil diperbarui! Silakan cek inbox email baru Anda untuk konfirmasi.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal mengupdate email",
    };
  }
}
