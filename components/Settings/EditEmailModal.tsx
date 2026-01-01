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
import { Edit, Loader2, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type Props = {
  currentEmail: string;
};

export function EditEmailModal({ currentEmail }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleVerifyEmail = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: currentEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/protected/edit/email?verified=true`,
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
        description: `Tautan verifikasi telah dikirim ke ${currentEmail}. Silakan cek kotak masuk Anda.`,
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
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit size={16} />
          Ubah Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Verifikasi Identitas
          </DialogTitle>
          <DialogDescription>
            Untuk keamanan akun Anda, kami perlu memverifikasi identitas Anda
            sebelum mengubah email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Email saat ini:
            </p>
            <p className="font-medium">{currentEmail}</p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Verifikasi Email Diperlukan
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Kami akan mengirimkan tautan verifikasi ke email Anda. Klik
                tautan tersebut untuk melanjutkan proses perubahan email.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Perhatian
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Pastikan email baru Anda valid dan dapat diakses. Anda akan
                menerima email konfirmasi di alamat email baru Anda.
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
                Kirim Verifikasi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
