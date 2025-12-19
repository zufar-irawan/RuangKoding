"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Editor } from "@/components/Editor/editor";
import TagSelector from "@/components/ui/tag-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { TagsType } from "@/lib/type";
import { getClientUser } from "@/utils/GetClientUser";
import { showXPAlert } from "@/utils/xpAlert";
import Swal from "sweetalert2";

export default function QuestionCreateForm() {
  const [title, setTitle] = useState("");
  const [bodyJson, setBodyJson] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [selectedTags, setSelectedTags] = useState<TagsType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleTagSubmit = async (questionId: number) => {
    const supabase = createClient();

    if (selectedTags.length === 0) {
      console.log("No tags to associate");
      return;
    }

    for (const tag of selectedTags) {
      // Validasi tag memiliki id yang valid
      if (!tag.id || typeof tag.id !== "number") {
        console.error("Invalid tag structure:", tag);
        continue;
      }

      const { error } = await supabase.from("quest_tags").insert({
        question_id: questionId,
        tag_id: tag.id,
      });

      if (error) {
        console.error("Failed to associate tag:", {
          tag: tag.tag,
          tagId: tag.id,
          questionId,
          error,
        });
      }
    }

    // Tampilkan feedback
    if (errorCount > 0 && successCount > 0) {
      toast.warning(
        `${successCount} tag berhasil ditambahkan, ${errorCount} gagal`,
      );
    } else if (errorCount > 0) {
      toast.error(`Gagal menambahkan ${errorCount} tag ke pertanyaan`);
    } else if (successCount > 0) {
      toast.success(`${successCount} tag berhasil ditambahkan`);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi form
    if (!title.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Judul pertanyaan tidak boleh kosong",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    if (!bodyJson.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Isi pertanyaan tidak boleh kosong",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await getClientUser();
      if (!user?.id) {
        Swal.fire({
          icon: "warning",
          title: "Login Diperlukan",
          text: "Anda harus login terlebih dahulu",
          confirmButtonColor: "#667eea",
        });
        router.push("/auth/login");
        return;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const payload = {
        user_id: user.id,
        title,
        excerpt,
        body: bodyJson,
        slug,
      };

      const supabase = createClient();

      // Insert question
      const { error, data } = await supabase
        .from("questions")
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error("Failed to submit question", error);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal membuat pertanyaan. Silakan coba lagi.",
          confirmButtonColor: "#667eea",
        });
        return;
      }

      // Associate tags
      await handleTagSubmit(data.id);

      // Show XP Alert
      showXPAlert({
        xp: 15,
        title: "Pertanyaan Berhasil Dibuat!",
        message:
          "Pertanyaanmu sudah dipublikasikan. Tunggu jawaban dari para sepuh!",
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Unexpected error:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Terjadi kesalahan. Silakan coba lagi.",
        confirmButtonColor: "#667eea",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-10 pb-4 flex flex-col flex-1 gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl text-primary font-bold">
          Tanyakan Pertanyaan!
        </h1>

        <p className="text-muted-foreground max-w-xl text-sm">
          Ajukan pertanyaan kepada para sepuh yang udah khatam kodingan! Dijamin
          dapet jawaban ga lebih dari satu tahun!
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

          <Editor
            onChange={setBodyJson}
            initialState={bodyJson}
            excerpt={setExcerpt}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-xl font-bold space-y-2">
            Tags
            <p className="text-muted-foreground text-sm font-normal">
              Tambahkan beberapa tag yang relevan dengan pertanyaanmu untuk
              memudahkan pencarian.
            </p>
          </div>

          <TagSelector
            value={selectedTags}
            updateTagsAction={setSelectedTags}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="default" disabled={isSubmitting}>
            {isSubmitting ? "Mengirim..." : "Kirim, dan tunggu jawabannya!"}
          </Button>
          <Button variant="outline" disabled={isSubmitting}>
            Simpan sebagai draft
          </Button>
        </div>
      </form>
    </div>
  );
}
