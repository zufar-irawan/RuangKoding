"use client";

import { useState } from "react";
import { Editor } from "@/components/Editor/editor";
import { Button } from "@/components/ui/button";
import { updateBio } from "@/lib/profiles";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type AboutEditorProps = {
  userId: string;
  initialBio: string | null;
};

export default function AboutEditor({ userId, initialBio }: AboutEditorProps) {
  const router = useRouter();
  const [bioContent, setBioContent] = useState<string>(initialBio || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateBio(userId, bioContent);
      toast.success("Bio berhasil disimpan!");
      router.push("/protected/about");
      router.refresh();
    } catch (error) {
      console.error("Error saving bio:", error);
      toast.error("Gagal menyimpan bio. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/protected/about");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Tentang Kamu</h1>
            <p className="text-muted-foreground mt-2">
              Ceritakan tentang dirimu, pengalaman, dan hal-hal menarik lainnya
            </p>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <Editor
            initialState={initialBio || undefined}
            onChange={(content) => setBioContent(content)}
            autoFocus={true}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
