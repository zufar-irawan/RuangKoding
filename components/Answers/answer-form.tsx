"use client";

import { Editor } from "../Editor/editor";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { getClientUser } from "@/utils/GetClientUser";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  questionId?: number;
  questionSlug: string | null;
};

export default function AnswerForm({ questionId, questionSlug }: Props) {
  const [bodyJson, setBodyJson] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bodyJson.trim()) {
      toast.error("Isi jawaban tidak boleh kosong!");

      return;
    }

    const user = await getClientUser();

    if (!user?.id) {
      toast.error("Anda harus login terlebih dahulu!");
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      user_id: user.id,
      question_id: questionId,
      content: bodyJson,
    };

    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("answers")
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error("Failed to submit answer", error);
        toast.error("Gagal mengirim jawaban. Silakan coba lagi.");
        return;
      }

      toast.success("Jawaban Berhasil Dikirim!");
      setBodyJson("");
      router.push(`/question/${questionSlug}-${questionId}`);
      router.refresh();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <Editor
        onChange={setBodyJson}
        initialState={bodyJson}
        autoFocus={false}
      />

      <div className="flex gap-2 w-full justify-end">
        <Button type="submit" variant={"default"} disabled={isSubmitting}>
          {isSubmitting ? "Mengirim..." : "Kirim Jawaban"}
          <Send />
        </Button>
      </div>
    </form>
  );
}
