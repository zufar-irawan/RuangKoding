"use server";

import { createClient } from "@/lib/supabase/server";
import supabaseAdmin from "@/lib/supabase/admin";

export interface DeleteAccountResult {
  success: boolean;
  error?: string;
}

export async function deleteUserAccount(
  userId: string,
  password: string,
): Promise<DeleteAccountResult> {
  try {
    const supabase = await createClient();

    // 1. Verifikasi bahwa user sudah login
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Authentication error:", authError);
      return {
        success: false,
        error: "Unauthorized: User not authenticated",
      };
    }

    // 2. Pastikan user hanya bisa menghapus akun sendiri
    if (user.id !== userId) {
      console.error("User ID mismatch:", {
        userId,
        authenticatedUserId: user.id,
      });
      return {
        success: false,
        error: "Forbidden: Cannot delete another user's account",
      };
    }

    // 3. Verifikasi password dengan mencoba sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: password,
    });

    if (signInError) {
      console.error("Password verification failed:", signInError.message);
      return {
        success: false,
        error: "Password verification failed",
      };
    }

    // 4. Hapus user dari auth (ini akan cascade delete data auth terkait)
    const { error: deleteError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Error deleting auth user:", {
        message: deleteError.message,
        status: deleteError.status,
      });
      return {
        success: false,
        error: "Failed to delete user account: " + deleteError.message,
      };
    }

    console.log("User account deleted successfully:", userId);
    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error in deleteUserAccount:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
