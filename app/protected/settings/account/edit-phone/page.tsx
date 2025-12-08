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
  Phone,
  Loader2,
  Save,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateUserPhone } from "@/lib/servers/UserActions";

export default function EditPhonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPhone, setCurrentPhone] = useState("");
  const [newPhone, setNewPhone] = useState("");
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

    // Get current user data
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentEmail(user.email || "");
        setCurrentPhone(user.phone || "");
        setNewPhone(user.phone || "");
      }
    };

    getCurrentUser();
  }, [verified, router, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (newPhone === currentPhone) {
      setMessage({
        type: "error",
        text: "Nomor telepon baru tidak boleh sama dengan nomor telepon lama",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call server action
      const result = await updateUserPhone(newPhone);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Nomor telepon berhasil diperbarui!",
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/protected/settings/account");
        }, 2000);
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
            text: result.error || "Gagal mengupdate nomor telepon",
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
            <Phone className="w-5 h-5" />
            {currentPhone ? "Ubah Nomor Telepon" : "Tambah Nomor Telepon"}
          </CardTitle>
          <CardDescription>
            {currentPhone
              ? "Masukkan nomor telepon baru Anda untuk verifikasi tambahan."
              : "Tambahkan nomor telepon untuk verifikasi tambahan."}
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
              <Label htmlFor="current-email">Email (Terverifikasi)</Label>
              <Input
                id="current-email"
                type="email"
                value={currentEmail}
                disabled
                className="bg-muted"
              />
            </div>

            {currentPhone && (
              <div className="space-y-2">
                <Label htmlFor="current-phone">Nomor Telepon Saat Ini</Label>
                <Input
                  id="current-phone"
                  type="tel"
                  value={currentPhone}
                  disabled
                  className="bg-muted"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-phone">
                {currentPhone ? "Nomor Telepon Baru" : "Nomor Telepon"}
              </Label>
              <Input
                id="new-phone"
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+62 812 3456 7890"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Gunakan format internasional (contoh: +62 812 3456 7890)
              </p>
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Catatan:</strong> Setelah mengubah nomor telepon, Anda
                  harus menunggu 7 hari sebelum dapat mengubah email atau nomor
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
