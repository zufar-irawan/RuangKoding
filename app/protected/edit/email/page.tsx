"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Loader2,
  Save,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateUserEmail } from "@/lib/servers/UserActions";

export default function EditEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Check if user is verified
    if (verified !== "true") {
      router.push("/protected/settings/account");
      return;
    }

    // Get current user email
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setCurrentEmail(user.email);
      }
    };

    getCurrentUser();
  }, [verified, router, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (newEmail === currentEmail) {
      setMessage({
        type: "error",
        text: "Email baru tidak boleh sama dengan email lama",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call server action
      const result = await updateUserEmail(newEmail);

      if (result.success) {
        setMessage({
          type: "success",
          text:
            result.message ||
            "Email berhasil diperbarui! Silakan cek inbox email baru Anda untuk konfirmasi.",
        });

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/protected/settings/account");
        }, 3000);
      } else {
        // Check if it's a rate limit error
        if (result.error?.includes("tunggu")) {
          setMessage({
            type: "warning",
            text: result.error,
          });
        } else {
          setMessage({
            type: "error",
            text: result.error || "Gagal mengupdate email",
          });
        }
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

  if (verified !== "true") {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/protected/settings/account")}
        className="mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Kembali ke Settings
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Ubah Email
          </CardTitle>
          <CardDescription>
            Masukkan email baru Anda. Anda akan menerima email konfirmasi untuk
            mengaktifkan email baru.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                  : message.type === "warning"
                    ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20"
                    : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === "success" && (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                {message.type === "warning" && <Clock className="w-4 h-4" />}
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-email">Email Saat Ini</Label>
              <Input
                id="current-email"
                type="email"
                value={currentEmail}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-email">Email Baru</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="emailbaru@example.com"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Link konfirmasi akan dikirim ke email baru Anda
              </p>
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Catatan:</strong> Setelah mengubah email, Anda harus
                  menunggu 7 hari sebelum dapat mengubah email atau nomor
                  telepon lagi.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/protected/settings/account")}
                disabled={isLoading}
                className="flex-1"
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
