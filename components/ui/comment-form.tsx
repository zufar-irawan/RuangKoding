"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

import type { AnswerCommentItem, AnswerWithHTML } from "@/lib/questions";
import { createComment, getComments } from "@/lib/answers";
import { Button } from "./button";

type Props = {
  answer: AnswerWithHTML;
};

export default function CommentForm({ answer }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<AnswerCommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [commentText, setCommentText] = useState("");

  const fetchComments = async (id: number) => {
    setIsLoading(true);

    try {
      const result = await getComments(id);

      setComments(result ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(answer.id);
  }, [answer.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = await createComment(answer.id, commentText);

    if (data) {
      setCommentText("");
      await fetchComments(answer.id);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Komentar ({comments.length})</h2>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <MessageSquare size={18} />
          {isOpen ? "Tutup" : "Tambah komentar"}
        </Button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
          <textarea
            className="w-full rounded-md border border-foreground/10 bg-transparent p-2 text-sm"
            placeholder="Tulis komentar..."
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>

            <Button type="submit" variant={"default"}>
              Simpan
            </Button>
          </div>
        </form>
      )}

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat komentar...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada komentar.</p>
        ) : (
          comments.map((comment) => {
            const profile = Array.isArray(comment.profiles)
              ? (comment.profiles[0] ?? null)
              : comment.profiles;

            return (
              <div
                key={comment.id}
                className="rounded-lg border border-foreground/10 p-3 text-sm"
              >
                <p className="font-semibold">
                  {profile?.fullname ?? "Pengguna"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(comment.created_at).toLocaleString("id-ID")}
                </p>
                <p className="mt-2 text-foreground">{comment.text}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
