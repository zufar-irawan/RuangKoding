import { createClient } from "./supabase/client";
import { getClientUser } from "@/utils/GetClientUser";

const deleteAnswer = async (answerId: number) => {
  const supabase = await createClient();

  // const user = await getClientUser();

  // if (!user?.id) {
  //   throw new Error("Pengguna harus login sebelum menghapus jawaban.");
  // }

  const { error } = await supabase.from("answers").delete().eq("id", answerId);

  if (error) {
    throw new Error(error.message);
  }
};

const getComments = async (id: number) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("answ_comment")
    .select(
      `
      id,
      text,
      created_at,
      reply_id,
      profiles(
       id,
       fullname,
       bio,
       profile_pic
      )
    `,
    )
    .eq("answer_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const createComment = async (id: number, text: string, reply?: number) => {
  const supabase = await createClient();

  const user = await getClientUser();

  if (!user?.id) {
    throw new Error("Pengguna harus login sebelum menambahkan komentar.");
  }

  const payload = {
    answer_id: id,
    user_id: user.id,
    text,
    reply_id: reply || null,
  };

  const { data, error } = await supabase.from("answ_comment").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const deleteComment = async (commentId: number) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("answ_comment")
    .delete()
    .eq("id", commentId);

  if (error) {
    throw new Error(error.message);
  }
};

export { getComments, createComment, deleteComment, deleteAnswer };
