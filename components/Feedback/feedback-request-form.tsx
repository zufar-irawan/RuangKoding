"use client";

import { FormEvent, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Editor } from "@/components/Editor/editor";
import TagSelector from "@/components/ui/tag-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TagsType } from "@/lib/type";
import { getClientUser } from "@/utils/GetClientUser";
import { toast } from "sonner";
import {
  createFeedbackRequest,
  associateRequestTags,
  uploadProjectIcon,
} from "@/lib/servers/FeedbackRequestAction";

export default function FeedbackRequestForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<TagsType[]>([]);
  const [projectIcon, setProjectIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Format file tidak valid. Hanya PNG, JPG, dan JPEG yang diperbolehkan.",
      );
      e.target.value = "";
      return;
    }

    // Validasi ukuran file (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Ukuran file terlalu besar. Maksimal 5MB.");
      e.target.value = "";
      return;
    }

    setProjectIcon(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveIcon = () => {
    setProjectIcon(null);
    setIconPreview(null);
  };

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

      // Upload project icon if provided
      let iconUrl: string | null = null;
      if (projectIcon) {
        const uploadResult = await uploadProjectIcon(projectIcon, user.id);
        if (!uploadResult.success) {
          toast.error(uploadResult.message);
          return;
        }
        iconUrl = uploadResult.url || null;
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
        icon_url: iconUrl,
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

        <div className="flex flex-col gap-1">
          <div className="text-xl font-bold space-y-2">
            Project Icon (Opsional)
            <p className="text-muted-foreground text-sm font-normal">
              Upload icon atau logo untuk projectmu. Format: PNG, JPG, JPEG.
              Maksimal 5MB.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Label
                htmlFor="project-icon"
                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                {projectIcon ? "Ganti Icon" : "Pilih Icon"}
              </Label>
              <Input
                id="project-icon"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleIconChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </div>

            {iconPreview && (
              <div className="relative">
                <div className="w-20 h-20 rounded-md border border-border overflow-hidden bg-muted">
                  <Image
                    src={iconPreview}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={handleRemoveIcon}
                  disabled={isSubmitting}
                >
                  ×
                </Button>
              </div>
            )}
          </div>

          {projectIcon && (
            <p className="text-xs text-muted-foreground">
              {projectIcon.name} ({(projectIcon.size / 1024 / 1024).toFixed(2)}{" "}
              MB)
            </p>
          )}
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
