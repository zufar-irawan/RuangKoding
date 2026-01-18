"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ReportData = {
  type: "question" | "answer" | "request" | "feedback" | "comment";
  reference: number;
  reason: string;
  additional_info?: string | null;
};

export async function submitReport(data: ReportData) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "Anda harus login untuk melaporkan konten",
      };
    }

    // Check if user already reported this content
    const { data: existingReport } = await supabase
      .from("report")
      .select("id")
      .eq("user_id", user.id)
      .eq("type", data.type)
      .eq("reference", data.reference)
      .single();

    if (existingReport) {
      return {
        success: false,
        error: "Kamu sudah melaporkan konten ini sebelumnya",
      };
    }

    // Merge additional_info into reason if provided
    const finalReason =
      data.additional_info && data.additional_info.trim()
        ? `${data.reason} - ${data.additional_info}`
        : data.reason;

    // Insert report
    const { error: insertError } = await supabase.from("report").insert({
      user_id: user.id,
      type: data.type,
      reference: data.reference,
      reason: finalReason,
    });

    if (insertError) {
      console.error("Error inserting report:", insertError);
      return {
        success: false,
        error: "Gagal mengirim laporan. Silakan coba lagi.",
      };
    }

    // Revalidate relevant paths
    revalidatePath("/");
    revalidatePath("/question/[slug]");
    revalidatePath("/request/[id]");

    return {
      success: true,
      message: "Laporan berhasil dikirim",
    };
  } catch (error) {
    console.error("Error in submitReport:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengirim laporan",
    };
  }
}
