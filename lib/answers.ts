import { createClient } from "./supabase/client";
import { getClientUser } from "@/utils/GetClientUser";

const getComments = async (id: number) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("answ_comment")
    .select(
      `
      id,
      text,
      created_at,
      profiles(
       id,
       fullname,
       bio,
       profile_pic
      )
    `,
    )
    .eq("answer_id", id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const createComment = async (id: number, text: string) => {
  const supabase = await createClient();

  const user = await getClientUser();

  if (!user?.id) {
    throw new Error("Pengguna harus login sebelum menambahkan komentar.");
  }

  const payload = {
    answer_id: id,
    user_id: user.id,
    text,
  };

  const { data, error } = await supabase.from("answ_comment").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export { getComments, createComment };
