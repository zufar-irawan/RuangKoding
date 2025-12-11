"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, AlertTriangle, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteUserAccount } from "@/lib/servers/AccountActions";

export default function DeleteAccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState({
    password: "",
  });
  const [confirmations, setConfirmations] = useState({
    understand: false,
    permanent: false,
    dataLoss: false,
  });
  const [error, setError] = useState("");

  const checkAccess = useCallback(async () => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) {
        toast.error("Sesi tidak valid", {
          description: "Silakan login terlebih dahulu.",
        });
        router.push("/auth/login");
        return;
      }

      setUserEmail(userData.user.email || "");
      setIsLoading(false);
    } catch (error) {
      console.error("Error in checkAccess:", error);
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti.",
      });
      router.push("/protected/settings");
    }
  }, [router, supabase]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  const validateForm = () => {
    if (!formData.password) {
      setError("Password wajib diisi untuk verifikasi");
      return false;
    }

    if (
      !confirmations.understand ||
      !confirmations.permanent ||
      !confirmations.dataLoss
    ) {
      toast.error("Konfirmasi diperlukan", {
        description: "Anda harus mencentang semua kotak konfirmasi.",
      });
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) {
        toast.error("Sesi tidak valid", {
          description: "Silakan login terlebih dahulu.",
        });
        router.push("/auth/login");
        return;
      }

      // Call server action to delete user account
      const result = await deleteUserAccount(
        userData.user.id,
        formData.password,
      );

      if (!result.success) {
        console.error("Error deleting account:", result.error);

        // Check if it's a password error
        if (result.error === "Password verification failed") {
          setError("Password yang Anda masukkan salah");
          toast.error("Verifikasi Gagal", {
            description: "Password yang Anda masukkan tidak sesuai.",
          });
        } else {
          toast.error("Gagal menghapus akun", {
            description:
              result.error || "Terjadi kesalahan saat menghapus akun Anda.",
          });
        }

        setIsSubmitting(false);
        return;
      }

      // Sign out user
      await supabase.auth.signOut();

      // Redirect ke halaman selamat tinggal
      router.push("/selamat-tinggal?terhapusselamanya=true");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti.",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 mt-12">
      <Card className="w-full max-w-md border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-destructive">
              Hapus Akun Permanen
            </CardTitle>
          </div>
          <CardDescription>
            Verifikasi identitas Anda untuk menghapus akun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Warning Alert */}
            <div className="relative w-full rounded-lg border p-4 bg-destructive/10 border-destructive/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-destructive">
                    Peringatan: Tindakan Tidak Dapat Dibatalkan
                  </p>
                  <p className="text-xs text-destructive/80">
                    Menghapus akun Anda akan menghapus semua data secara
                    permanen:
                  </p>
                  <ul className="text-xs text-destructive/80 list-disc list-inside space-y-1">
                    <li>Profil dan informasi pribadi</li>
                    <li>Semua pertanyaan yang Anda ajukan</li>
                    <li>Semua jawaban dan komentar</li>
                    <li>Riwayat aktivitas dan poin</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Email Display */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">
                Akun yang akan dihapus:
              </p>
              <p className="text-sm font-medium">{userEmail}</p>
            </div>

            {/* Password Verification */}
            <div className="space-y-2">
              <Label htmlFor="password">Verifikasi Password Anda</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ password: e.target.value })}
                  placeholder="Masukkan password Anda"
                  className={error ? "border-destructive" : ""}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            {/* Confirmations */}
            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium">Konfirmasi pemahaman Anda:</p>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="understand"
                  checked={confirmations.understand}
                  onCheckedChange={(checked) =>
                    setConfirmations({
                      ...confirmations,
                      understand: checked as boolean,
                    })
                  }
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="understand"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Saya memahami bahwa tindakan ini tidak dapat dibatalkan
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="permanent"
                  checked={confirmations.permanent}
                  onCheckedChange={(checked) =>
                    setConfirmations({
                      ...confirmations,
                      permanent: checked as boolean,
                    })
                  }
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="permanent"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Saya memahami bahwa akun saya akan dihapus secara permanen
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="dataLoss"
                  checked={confirmations.dataLoss}
                  onCheckedChange={(checked) =>
                    setConfirmations({
                      ...confirmations,
                      dataLoss: checked as boolean,
                    })
                  }
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="dataLoss"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Saya memahami bahwa semua data saya akan hilang selamanya
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/protected/settings")}
                disabled={isSubmitting}
                className="flex-1"
              >
                Batalkan
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Akun
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
