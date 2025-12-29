"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CreateExplainRequestInput {
  language: string;
  code: string;
}

export interface UpdateQuestionAnswerInput {
  questionId: number;
  answer: string;
}

export async function createExplainRequest(input: CreateExplainRequestInput) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "User tidak terautentikasi",
      };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("firstname")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        message: "Gagal mengambil data profile",
      };
    }

    // Insert code explain request
    const { data: explainRequest, error: insertError } = await supabase
      .from("code_explain_request")
      .insert({
        code: input.code,
        language: input.language,
        user_id: user.id,
        firstname: profile.firstname,
      })
      .select()
      .single();

    if (insertError || !explainRequest) {
      return {
        success: false,
        message: "Gagal membuat request",
      };
    }

    revalidatePath("/explain-your-code");

    return {
      success: true,
      message: "Request berhasil dibuat",
      data: explainRequest,
    };
  } catch (error) {
    console.error("Error creating explain request:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat request",
    };
  }
}

export async function getExplainRequestHistory(
  page: number = 1,
  limit: number = 10,
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "User tidak terautentikasi",
      };
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("code_explain_request")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .eq("is_analyzed", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return {
        success: false,
        message: "Gagal mengambil history",
      };
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return {
      success: true,
      data: data || [],
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error getting explain request history:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengambil history",
    };
  }
}

export async function getAIQuestion(codeId: number) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "User tidak terautentikasi",
      };
    }

    const { data, error } = await supabase
      .from("code_ai_question")
      .select("*")
      .eq("code_id", codeId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return {
          success: true,
          data: null,
        };
      }
      return {
        success: false,
        message: "Gagal mengambil pertanyaan AI",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error getting AI question:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengambil pertanyaan AI",
    };
  }
}

export async function updateQuestionAnswer(input: UpdateQuestionAnswerInput) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "User tidak terautentikasi",
      };
    }

    const { error: updateError } = await supabase
      .from("code_ai_question")
      .update({ answer: input.answer })
      .eq("id", input.questionId)
      .eq("user_id", user.id);

    if (updateError) {
      return {
        success: false,
        message: "Gagal mengupdate jawaban",
      };
    }

    revalidatePath("/explain-your-code");

    return {
      success: true,
      message: "Jawaban berhasil disimpan",
    };
  } catch (error) {
    console.error("Error updating question answer:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengupdate jawaban",
    };
  }
}

export async function getAIReview(codeId: number) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "User tidak terautentikasi",
      };
    }

    const { data, error } = await supabase
      .from("code_ai_review")
      .select("*")
      .eq("code_id", codeId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return {
          success: true,
          data: null,
        };
      }
      return {
        success: false,
        message: "Gagal mengambil review AI",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error getting AI review:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengambil review AI",
    };
  }
}
