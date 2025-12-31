"use client";

import { useEffect, useState, Suspense } from "react";
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

// Komponen Internal yang menggunakan searchParams
function EditEmailForm() {
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
      const result = await updateUserEmail(newEmail);

      if (result.success) {
        setMessage({
          type: "success",
          text:
            result.message ||
            "Email berhasil diperbarui! Silakan cek inbox email baru Anda untuk konfirmasi.",
        });

        setTimeout(() => {
          router.push("/protected/settings/account");
        }, 3000);
      } else {
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
    <div className="container max-w-2xl mx-auto py-4 sm:py-6 md:py-10 px-2 sm:px-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/protected/settings/account")}
        className="mb-4 sm:mb-6 text-xs sm:text-sm"
      >
        <ArrowLeft size={14} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        Kembali ke Settings
      </Button>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            Ubah Email
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Masukkan email baru Anda. Anda akan menerima email konfirmasi untuk
            mengaktifkan email baru.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {message && (
            <div
              className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg ${message.type === "success"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                  : message.type === "warning"
                    ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20"
                    : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                }`}
            >
              <div className="flex items-center gap-2">
                {message.type === "success" && (
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                )}
                {message.type === "warning" && (
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                )}
                <p className="text-xs sm:text-sm">{message.text}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-email" className="text-sm">
                Email Saat Ini
              </Label>
              <Input
                id="current-email"
                type="email"
                value={currentEmail}
                disabled
                className="bg-muted text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-email" className="text-sm">
                Email Baru
              </Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="emailbaru@example.com"
                required
                disabled={isLoading}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Link konfirmasi akan dikirim ke email baru Anda
              </p>
            </div>

            <div className="p-2 sm:p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Catatan:</strong> Setelah mengubah email, Anda harus
                  menunggu 7 hari sebelum dapat mengubah email atau nomor
                  telepon lagi.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/protected/settings/account")}
                disabled={isLoading}
                className="flex-1 text-sm"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={14}
                      className="sm:w-4 sm:h-4 animate-spin mr-2"
                    />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={14} className="sm:w-4 sm:h-4 mr-2" />
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

// Komponen Utama (Export Default) dengan Suspense Boundary
export default function EditEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <EditEmailForm />
    </Suspense>
  );
}