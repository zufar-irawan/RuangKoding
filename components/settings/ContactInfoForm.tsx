"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Save, Loader2 } from "lucide-react";
import { updateAccountContactInfo } from "@/app/protected/settings/account/actions";
import { useRouter } from "next/navigation";

type Props = {
  currentEmail: string;
  currentPhone?: string | null;
};

export function ContactInfoForm({ currentEmail, currentPhone }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await updateAccountContactInfo(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Berhasil mengupdate informasi kontak!",
        });
        router.refresh();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Gagal mengupdate informasi kontak",
        });
      }
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message Alert */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium flex items-center gap-2"
        >
          <Mail size={16} className="text-muted-foreground" />
          Email
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          defaultValue={currentEmail}
          placeholder="email@example.com"
          className="w-full"
          required
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Email digunakan untuk notifikasi penting{" "}
          <span className="font-bold">
            (Note: Jika email diubah, kamu akan menerima email konfirmasi untuk
            mengaktifkan email baru.)
          </span>
        </p>
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="text-sm font-medium flex items-center gap-2"
        >
          <Phone size={16} className="text-muted-foreground" />
          Nomor Telepon
        </Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={currentPhone || ""}
          placeholder="+62 812 3456 7890"
          className="w-full"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Nomor telepon opsional untuk verifikasi tambahan
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save size={16} />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
