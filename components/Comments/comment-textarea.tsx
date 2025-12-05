"use client";

import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  value: string;
  onChangeAction: (value: string) => void;
  onSubmitAction: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancelAction: () => void;
  placeholder?: string;
  rows?: number;
  isLoading?: boolean;
  submitText?: string;
};

export default function CommentTextarea({
  value,
  onChangeAction,
  onSubmitAction,
  onCancelAction,
  placeholder = "Tulis komentar...",
  rows = 3,
  isLoading = false,
  submitText = "Simpan",
}: Props) {
  return (
    <form onSubmit={onSubmitAction} className="mt-3 flex flex-col gap-2">
      <textarea
        className="w-full rounded-md border border-foreground/10 bg-transparent p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={(e) => onChangeAction(e.target.value)}
        required
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancelAction}
          disabled={isLoading}
        >
          Batal
        </Button>

        <Button type="submit" size="sm" disabled={isLoading || !value.trim()}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );
}
