"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/Editor/editor";
import { createFeedback } from "@/lib/servers/FeedbackAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
  requestId: number;
};

export default function FeedbackForm({ requestId }: Props) {
  const router = useRouter();
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleSubmit = async () => {
    if (!feedbackContent.trim()) {
      toast.error("Feedback tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedContent = JSON.parse(feedbackContent);
      await createFeedback(requestId, parsedContent);

      toast.success("Feedback berhasil ditambahkan!");
      setFeedbackContent("");
      setShowEditor(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating feedback:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan feedback. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showEditor) {
    return (
      <div className="w-full">
        <Button
          onClick={() => setShowEditor(true)}
          className="w-full sm:w-auto"
        >
          Tambahkan Feedback
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 p-6 border border-foreground/10 rounded-lg bg-card">
      <h3 className="text-xl font-semibold">Tambahkan Feedback Baru</h3>

      <Editor
        onChange={(content) => setFeedbackContent(content)}
        autoFocus={true}
      />

      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setShowEditor(false);
            setFeedbackContent("");
          }}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            "Kirim Feedback"
          )}
        </Button>
      </div>
    </div>
  );
}
