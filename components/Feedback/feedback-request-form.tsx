"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Editor } from "@/components/Editor/editor";
import TagSelector from "@/components/ui/tag-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TagsType } from "@/lib/type";
import { getClientUser } from "@/utils/GetClientUser";
import { toast } from "sonner";
import {
  createFeedbackRequest,
  associateRequestTags,
} from "@/lib/servers/FeedbackRequestAction";

export default function FeedbackRequestForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<TagsType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi form
    if (!title.trim()) {
      toast.error("Judul tidak boleh kosong");
      return;
    }

    if (!projectUrl.trim()) {
      toast.error("URL Project tidak boleh kosong");
      return;
    }

    if (!description.trim()) {
      toast.error("Deskripsi tidak boleh kosong");
      return;
    }

    // Validasi URL format
    try {
      new URL(projectUrl);
    } catch {
      toast.error(
        "Format URL tidak valid. Pastikan URL dimulai dengan http:// atau https://",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await getClientUser();
      if (!user?.id) {
        toast.warning("Anda harus login terlebih dahulu");
        router.push("/auth/login");
        return;
      }

      // Parse description as JSON
      let descriptionJson;
      try {
        descriptionJson = JSON.parse(description);
      } catch {
        descriptionJson = description;
      }

      // Create feedback request
      const result = await createFeedbackRequest({
        title,
        description: descriptionJson,
        project_url: projectUrl,
        user_id: user.id,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      // Associate tags if request was successful
      if (result.data && selectedTags.length > 0) {
        const tagIds = selectedTags
          .map((tag) => tag.id)
          .filter((id): id is number => typeof id === "number");

        const tagResult = await associateRequestTags({
          request_id: result.data.id,
          tag_ids: tagIds,
        });

        if (tagResult.errorCount && tagResult.errorCount > 0) {
          if (tagResult.successCount && tagResult.successCount > 0) {
            toast.warning(tagResult.message);
          } else {
            toast.error(tagResult.message);
          }
        } else if (tagResult.successCount && tagResult.successCount > 0) {
          toast.success(tagResult.message);
        }
      }

      toast.success(result.message);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-10 pb-4 flex flex-col flex-1 gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl text-primary font-bold">
          Request Feedback untuk Projectmu!
        </h1>

        <p className="text-muted-foreground max-w-xl text-sm">
          Minta feedback dari para sepuh untuk project kamu! Dapatkan saran dan
          masukan yang berguna untuk meningkatkan kualitas project!
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <div className="text-xl font-bold space-y-2">
            Judul
            <p className="text-muted-foreground text-sm font-normal">
              Buat judul yang jelas dan spesifik untuk permintaan feedbackmu!
            </p>
          </div>

          <Input
            placeholder="Contoh: Review Website Portfolio Saya"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-xl font-bold space-y-2">
            URL Project
            <p className="text-muted-foreground text-sm font-normal">
              Masukkan link ke project kamu (GitHub, Live Demo, dll)
            </p>
          </div>

          <Input
            placeholder="https://github.com/username/project atau https://myproject.com"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            type="url"
          />
        </div>

        <div className="flex flex-col justify-start">
          <div className="text-xl font-bold space-y-2">
            Deskripsi
            <p className="text-muted-foreground text-sm font-normal">
              Jelaskan tentang projectmu dan aspek apa yang ingin kamu dapatkan
              feedbacknya.
            </p>
          </div>

          <Editor onChange={setDescription} initialState={description} />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-xl font-bold space-y-2">
            Tags
            <p className="text-muted-foreground text-sm font-normal">
              Tambahkan tag yang relevan dengan project kamu untuk memudahkan
              pencarian.
            </p>
          </div>

          <TagSelector
            value={selectedTags}
            updateTagsAction={setSelectedTags}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="default" disabled={isSubmitting}>
            {isSubmitting ? "Mengirim..." : "Kirim Request Feedback!"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.back()}
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
