"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Trash2,
  Loader2,
  Mail,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function DeleteAccountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleVerifyEmail = async () => {
    setIsLoading(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user?.email) {
        toast.error("Gagal Mendapatkan Informasi User", {
          description: "Silakan coba lagi nanti.",
        });
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: userData.user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/protected/edit/delete`,
          shouldCreateUser: false,
        },
      });

      if (error) {
        toast.error("Gagal Mengirim Verifikasi", {
          description: error.message,
        });
        return;
      }

      toast.success("Verifikasi Terkirim!", {
        description: `Tautan verifikasi telah dikirim ke ${userData.user.email}. Silakan cek kotak masuk Anda.`,
        duration: 5000,
      });
      setIsOpen(false);
    } catch (error: unknown) {
      toast.error("Terjadi Kesalahan", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-2 shrink-0"
        >
          <Trash2 size={16} />
          Hapus Akun
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="w-5 h-5" />
            Verifikasi Penghapusan Akun
          </DialogTitle>
          <DialogDescription>
            Untuk keamanan, kami perlu memverifikasi identitas Anda sebelum
            menghapus akun secara permanen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-destructive">
                Peringatan: Tindakan Permanen
              </p>
              <p className="text-xs text-destructive/80">
                Menghapus akun akan menghapus semua data Anda secara permanen,
                termasuk profil, pertanyaan, jawaban, komentar, dan riwayat
                aktivitas. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Verifikasi Email Diperlukan
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Kami akan mengirimkan tautan verifikasi ke email Anda. Klik
                tautan tersebut untuk melanjutkan proses penghapusan akun.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleVerifyEmail}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Mengirim...
              </>
            ) : (
              <>
                <Mail size={16} className="mr-2" />
                Kirim Verifikasi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
