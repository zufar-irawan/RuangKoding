"use server";

import { createClient } from "@/lib/supabase/server";
import { updateContactInfo } from "@/lib/profiles";
import { revalidatePath } from "next/cache";

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
    await updateContactInfo(user.id, {
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
