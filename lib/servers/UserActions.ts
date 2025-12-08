"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Server-side helper to update profiles table
async function updateProfileContactInfo(
  userId: string,
  data: {
    email: string;
    phone: string | null;
  },
) {
  const supabase = await createClient();

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single();

  if (!existingProfile) {
    // Profile doesn't exist, skip update
    // Profile will be created by other processes (e.g., signup trigger)
    return;
  }

  // Update profiles table
  const { error } = await supabase
    .from("profiles")
    .update({
      email: data.email,
      phone: data.phone,
    })
    .eq("id", userId);

  if (error) {
    throw new Error("Gagal mengupdate profiles: " + error.message);
  }
}

// Helper function to check if user can update auth info
async function checkAuthUpdateLimit(userId: string) {
  const supabase = await createClient();

  // Get the last update time from user_auth_limit
  const { data, error } = await supabase
    .from("user_auth_limit")
    .select("last_auth_updated_at")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows returned, which is okay for first time
    throw new Error("Gagal memeriksa batas waktu update");
  }

  // If no data, this is the first time updating
  if (!data) {
    return { canUpdate: true, isFirstTime: true };
  }

  // Check if 7 days have passed
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

// Helper function to update auth limit record
async function updateAuthLimit(userId: string, isFirstTime: boolean) {
  const supabase = await createClient();
  const now = new Date().toISOString();

  if (isFirstTime) {
    // Insert new record
    const { error } = await supabase.from("user_auth_limit").insert({
      user_id: userId,
      last_auth_updated_at: now,
    });

    if (error) {
      throw new Error("Gagal menyimpan data batas waktu update");
    }
  } else {
    // Update existing record
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

  // Get current user
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

  // Validate: new email should not be same as current
  if (newEmail === user.email) {
    return {
      success: false,
      error: "Email baru tidak boleh sama dengan email lama",
    };
  }

  try {
    // Check if user can update (7 days limit)
    const limitCheck = await checkAuthUpdateLimit(user.id);

    if (!limitCheck.canUpdate) {
      return {
        success: false,
        error: `Anda sudah mengubah informasi autentikasi. Silakan tunggu ${limitCheck.daysRemaining} hari lagi untuk melakukan perubahan.`,
      };
    }

    // Update email in auth.users
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
      phone: user.phone || null,
    });

    // Revalidate the page to show updated data
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

export async function updateUserPhone(newPhone: string) {
  const supabase = await createClient();

  // Get current user
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

  // Validate: new phone should not be same as current
  if (newPhone === user.phone) {
    return {
      success: false,
      error: "Nomor telepon baru tidak boleh sama dengan nomor telepon lama",
    };
  }

  try {
    // Check if user can update (7 days limit)
    const limitCheck = await checkAuthUpdateLimit(user.id);

    if (!limitCheck.canUpdate) {
      return {
        success: false,
        error: `Anda sudah mengubah informasi autentikasi. Silakan tunggu ${limitCheck.daysRemaining} hari lagi untuk melakukan perubahan.`,
      };
    }

    // Update phone in auth.users
    const { error: phoneError } = await supabase.auth.updateUser({
      phone: newPhone,
    });

    if (phoneError) {
      return {
        success: false,
        error: "Gagal mengupdate nomor telepon: " + phoneError.message,
      };
    }

    // Update auth limit record
    await updateAuthLimit(user.id, limitCheck.isFirstTime);

    // Update profiles table
    await updateProfileContactInfo(user.id, {
      email: user.email || "",
      phone: newPhone,
    });

    // Revalidate the page to show updated data
    revalidatePath("/protected/settings/account");

    return {
      success: true,
      message: "Nomor telepon berhasil diperbarui!",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal mengupdate nomor telepon",
    };
  }
}

export async function updateAccountContactInfo(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "User not authenticated",
    };
  }

  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  try {
    // Update email in auth.users if changed
    if (email && email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: email,
      });

      if (emailError) {
        return {
          success: false,
          error: "Gagal mengupdate email: " + emailError.message,
        };
      }
    }

    // Update phone in auth.users if provided
    if (phone) {
      const { error: phoneError } = await supabase.auth.updateUser({
        phone: phone,
      });

      if (phoneError) {
        return {
          success: false,
          error: "Gagal mengupdate phone: " + phoneError.message,
        };
      }
    }

    // Update profiles table
    await updateProfileContactInfo(user.id, {
      email: email,
      phone: phone || null,
    });

    // Revalidate the page to show updated data
    revalidatePath("/protected/settings/account");

    return {
      success: true,
      message:
        email !== user.email
          ? "Email konfirmasi telah dikirim. Silakan cek inbox untuk mengaktifkan email baru."
          : "Informasi kontak berhasil diperbarui!",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal mengupdate informasi kontak",
    };
  }
}
