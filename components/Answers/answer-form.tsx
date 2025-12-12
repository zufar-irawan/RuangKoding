"use client";

import { Editor } from "../Editor/editor";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { getClientUser } from "@/utils/GetClientUser";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  questionId?: number;
  questionSlug: string | null;
};

export default function AnswerForm({ questionId, questionSlug }: Props) {
  const [bodyJson, setBodyJson] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = await getClientUser();

    if (!user?.id) {
      router.push("/auth/login");
      return;
    }

    const payload = {
      user_id: user.id,
      question_id: questionId,
      content: bodyJson,
    };

    const supabase = createClient();

    const { error, data } = await supabase
      .from("answers")
      .insert(payload)
      .select()
      .single();
    if (error) {
      console.error("Failed to submit answer", error);
    } else {
      console.log("Answer submitted successfully", data);

      setBodyJson("");
      router.push(`/question/${questionSlug}-${questionId}`);
      router.refresh();
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
        <Button type="submit" variant={"default"}>
          Kirim Jawaban
          <Send />
        </Button>
      </div>
    </form>
  );
}
