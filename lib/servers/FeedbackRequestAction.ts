"use server";

import { createClient } from "../supabase/server";
import { Json } from "../supabase/types";

type CreateFeedbackRequestParams = {
  title: string;
  description: Json;
  project_url: string;
  user_id: string;
};

type CreateFeedbackRequestResult = {
  success: boolean;
  message: string;
  data?: {
    id: number;
    title: string;
  };
};

export async function createFeedbackRequest(
  params: CreateFeedbackRequestParams,
): Promise<CreateFeedbackRequestResult> {
  try {
    const supabase = await createClient();

    // Validasi input
    if (!params.title.trim()) {
      return {
        success: false,
        message: "Judul tidak boleh kosong",
      };
    }

    if (!params.project_url.trim()) {
      return {
        success: false,
        message: "URL Project tidak boleh kosong",
      };
    }

    // Validasi URL format
    try {
      new URL(params.project_url);
    } catch {
      return {
        success: false,
        message: "Format URL tidak valid",
      };
    }

    // Insert feedback request
    const { data, error } = await supabase
      .from("request_feedback")
      .insert({
        title: params.title,
        description: params.description,
        project_url: params.project_url,
        user_id: params.user_id,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create feedback request:", error);
      return {
        success: false,
        message: "Gagal membuat permintaan feedback. Silakan coba lagi.",
      };
    }

    return {
      success: true,
      message: "Permintaan feedback berhasil dibuat!",
      data: {
        id: data.id,
        title: data.title,
      },
    };
  } catch (error) {
    console.error("Unexpected error in createFeedbackRequest:", error);
    return {
      success: false,
      message: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
    };
  }
}

type AssociateRequestTagsParams = {
  request_id: number;
  tag_ids: number[];
};

type AssociateRequestTagsResult = {
  success: boolean;
  message: string;
  successCount?: number;
  errorCount?: number;
};

export async function associateRequestTags(
  params: AssociateRequestTagsParams,
): Promise<AssociateRequestTagsResult> {
  try {
    const supabase = await createClient();

    if (params.tag_ids.length === 0) {
      return {
        success: true,
        message: "Tidak ada tag untuk ditambahkan",
        successCount: 0,
        errorCount: 0,
      };
    }

    let errorCount = 0;
    let successCount = 0;

    for (const tag_id of params.tag_ids) {
      const { error } = await supabase.from("request_tags").insert({
        request_id: params.request_id,
        tag_id: tag_id,
      });

      if (error) {
        errorCount++;
        console.error("Failed to associate tag:", {
          tag_id,
          request_id: params.request_id,
          error,
        });
      } else {
        successCount++;
      }
    }

    if (errorCount > 0 && successCount > 0) {
      return {
        success: true,
        message: `${successCount} tag berhasil ditambahkan, ${errorCount} gagal`,
        successCount,
        errorCount,
      };
    } else if (errorCount > 0) {
      return {
        success: false,
        message: `Gagal menambahkan ${errorCount} tag`,
        successCount: 0,
        errorCount,
      };
    } else {
      return {
        success: true,
        message: `${successCount} tag berhasil ditambahkan`,
        successCount,
        errorCount: 0,
      };
    }
  } catch (error) {
    console.error("Unexpected error in associateRequestTags:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menambahkan tags",
      successCount: 0,
      errorCount: params.tag_ids.length,
    };
  }
}
