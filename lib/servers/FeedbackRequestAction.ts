"use server";

import { createClient } from "../supabase/server";
import { Json } from "../supabase/types";

type UploadProjectIconResult = {
  success: boolean;
  message: string;
  url?: string;
};

export async function uploadProjectIcon(
  file: File,
  userId: string,
): Promise<UploadProjectIconResult> {
  try {
    // Validasi tipe file
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message:
          "Format file tidak valid. Hanya PNG, JPG, dan JPEG yang diperbolehkan.",
      };
    }

    // Validasi ukuran file (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        message: "Ukuran file terlalu besar. Maksimal 5MB.",
      };
    }

    const supabase = await createClient();

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    // Upload file to bucket
    const { error: uploadError } = await supabase.storage
      .from("project_icon")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Failed to upload icon:", uploadError);
      return {
        success: false,
        message: "Gagal mengupload icon. Silakan coba lagi.",
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("project_icon").getPublicUrl(fileName);

    return {
      success: true,
      message: "Icon berhasil diupload!",
      url: publicUrl,
    };
  } catch (error) {
    console.error("Unexpected error in uploadProjectIcon:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengupload icon.",
    };
  }
}

type CreateFeedbackRequestParams = {
  title: string;
  description: Json;
  project_url: string;
  user_id: string;
  icon_url?: string | null;
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
        icon_url: params.icon_url || null,
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

type FeedbackRequestListItem = {
  id: number;
  title: string;
  description: Json | null;
  project_url: string;
  icon_url: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    fullname: string;
  } | null;
};

type GetFeedbackRequestsParams = {
  page?: number;
  limit?: number;
};

type GetFeedbackRequestsResult = {
  success: boolean;
  message: string;
  data?: FeedbackRequestListItem[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
};

export async function getFeedbackRequests(
  params: GetFeedbackRequestsParams = {},
): Promise<GetFeedbackRequestsResult> {
  try {
    const supabase = await createClient();
    const page = params.page || 1;
    const limit = params.limit || 30;
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await supabase
      .from("request_feedback")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Failed to get feedback requests count:", countError);
      return {
        success: false,
        message: "Gagal mengambil jumlah data",
      };
    }

    // Get paginated data
    const { data, error } = await supabase
      .from("request_feedback")
      .select(
        `
        id,
        title,
        description,
        project_url,
        icon_url,
        created_at,
        user_id,
        profiles (
          fullname
        )
      `,
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Failed to get feedback requests:", error);
      return {
        success: false,
        message: "Gagal mengambil data feedback request",
      };
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      success: true,
      message: "Data berhasil diambil",
      data: data as FeedbackRequestListItem[],
      total: count || 0,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Unexpected error in getFeedbackRequests:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengambil data",
    };
  }
}
