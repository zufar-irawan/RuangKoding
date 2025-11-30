'use client';

import { Editor } from "../Editor/editor";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { getUser } from "@/utils/GetUser";
import { Send } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

type Props = {
    questionId?: number;
}

export default function AnswerForm({ questionId }: Props) {
    const [bodyJson, setBodyJson] = useState("");


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = await getUser();

        const payload = {
            user_id: user?.sub,
            question_id: questionId,
            content: bodyJson,
        }

        const supabase = await createClient();

        const { error, data } = await supabase.from("answers").insert(payload).select().single();
        if (error) {
            console.error("Failed to submit answer", error);
        } else {
            console.log("Answer submitted successfully", data);

            setBodyJson("");
            redirect(`/question/${data.question_id}`);
        }
    }

    return (
        <form className="flex flex-col" onSubmit={handleSubmit}>
            <Editor onChange={setBodyJson} initialState={bodyJson} />

            <div className="flex gap-2 w-full justify-end">
                <Button type="submit" variant={"default"}>
                    Kirim Jawaban
                    <Send />
                </Button>
            </div >
        </form >
    )
}