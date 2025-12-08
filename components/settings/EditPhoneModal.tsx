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
import { Edit, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  currentEmail: string;
  currentPhone?: string | null;
  SuccessAction: (message: string) => void;
  ErrorAction: (message: string) => void;
};

export function EditPhoneModal({
  currentEmail,
  currentPhone,
  SuccessAction,
  ErrorAction,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleVerifyEmail = async () => {
    setIsLoading(true);

    try {
      // Kirim Magic Link ke email lama untuk verifikasi
      const { error } = await supabase.auth.signInWithOtp({
        email: currentEmail,
        options: {
          // Redirect ke halaman edit phone setelah verifikasi
          emailRedirectTo: `${window.location.origin}/protected/settings/account/edit-phone?verified=true`,
          shouldCreateUser: false,
        },
      });

      if (error) {
        ErrorAction(`Gagal mengirim verifikasi: ${error.message}`);
        return;
      }

      SuccessAction(
        "Tautan verifikasi telah dikirim ke email Anda. Silakan cek kotak masuk Anda.",
      );
      setIsOpen(false);
    } catch (error: unknown) {
      ErrorAction(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit size={16} />
          {currentPhone ? "Ubah Telepon" : "Tambah Telepon"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Verifikasi Identitas
          </DialogTitle>
          <DialogDescription>
            Kami harus memastikan bahwa yang melakukan perubahan adalah Anda
            sebagai pemilik asli akun ini.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Email saat ini:
            </p>
            <p className="font-medium">{currentEmail}</p>
            {currentPhone && (
              <>
                <p className="text-sm text-muted-foreground mt-3 mb-2">
                  Nomor telepon saat ini:
                </p>
                <p className="font-medium">{currentPhone}</p>
              </>
            )}
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Verifikasi diperlukan
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Kami akan mengirimkan tautan verifikasi ke email Anda saat ini.
                Klik tautan tersebut untuk melanjutkan proses perubahan nomor
                telepon.
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
          <Button onClick={handleVerifyEmail} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Mengirim...
              </>
            ) : (
              <>
                <Mail size={16} className="mr-2" />
                Verifikasi Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
