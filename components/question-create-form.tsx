"use client"

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Undo2 } from "lucide-react";

import { Editor } from "@/components/Editor/editor";
import TagSelector from "@/components/ui/tag-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { TagsType } from "@/lib/type";

import { redirect } from "next/navigation";

export default function QuestionCreateForm() {
    const [title, setTitle] = useState("");
    const [bodyJson, setBodyJson] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [selectedTags, setSelectedTags] = useState<TagsType[]>([]);

    const getUser = async () => {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getClaims();
        if (error || !data?.claims) {
            redirect("/auth/login");
        }
        return data.claims;
    }

    const handleTagSubmit = async (post_id: number) => {
        const supabase = await createClient();

        for (const tag of selectedTags) {
            const { error } = await supabase.from("quest_tags").insert({
                post_id,
                tag_id: tag.id,
            });

            if (error) {
                console.error("Failed to associate tag", error);
            }
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = await getUser();

        const payload = {
            user_id: user?.sub,
            title,
            excerpt,
            body: bodyJson,
        };

        const supabase = await createClient();

        const { error, data } = await supabase.from("questions").insert(payload).select().single();
        if (error) {
            console.error("Failed to submit question", error);
        } else {
            await handleTagSubmit(data.id);

            redirect("/");
        }
    };

    return (
        <div className="px-10 py-3 flex flex-col flex-1 gap-8">
            <div className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                    <Link href="/question" className="hover:bg-foreground/10 p-2 rounded-lg">
                        <Undo2 className="text-primary" size={24} />
                    </Link>

                    <h1 className="text-2xl text-primary font-bold">Tanyakan Pertanyaan!</h1>
                </div>

                <p className="text-muted-foreground max-w-xl text-sm">
                    Ajukan pertanyaan kepada para sepuh yang udah khatam kodingan!
                    Dijamin dapet jawaban ga lebih dari satu tahun!
                </p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
                    <div className="text-xl font-bold space-y-2">
                        Judul

                        <p className="text-muted-foreground text-sm font-normal">
                            Buat judul pertanyaanmu yang spesifik!
                        </p>
                    </div>

                    <Input
                        placeholder="Masukkin judulmu yang unik!"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="flex flex-col justify-start">
                    <div className="text-xl font-bold space-y-2">
                        Isi Pertanyaan

                        <p className="text-muted-foreground text-sm font-normal">
                            Jelaskan secara rinci mengenai pertanyaan yang ingin kamu ajukan.
                        </p>
                    </div>

                    <Editor onChange={setBodyJson} excerpt={setExcerpt} />
                </div>

                <div className="flex flex-col gap-1">
                    <div className="text-xl font-bold space-y-2">
                        Tags

                        <p className="text-muted-foreground text-sm font-normal">
                            Tambahkan beberapa tag yang relevan dengan pertanyaanmu untuk memudahkan pencarian.
                        </p>
                    </div>

                    <TagSelector value={selectedTags} onChange={setSelectedTags} />
                </div>

                <div className="flex gap-4">
                    <Button type="submit" variant="default">
                        Kirim, dan tunggu jawabannya!
                    </Button>

                    <Button variant="outline">
                        Simpan sebagai draft
                    </Button>
                </div>
            </form>
        </div>
    );
}
