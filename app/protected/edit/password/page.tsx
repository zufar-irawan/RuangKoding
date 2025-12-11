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
import {
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canChangePassword, setCanChangePassword] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

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

      const userId = userData.user.id;

      // Cek apakah user sudah pernah update password
      const { data: authLimit, error: authError } = await supabase
        .from("user_auth_limit")
        .select("*")
        .eq("user_id", userId)
        .eq("type", "Password")
        .single();

      if (authError && authError.code !== "PGRST116") {
        console.error("Error checking auth limit:", authError);
        toast.error("Terjadi kesalahan", {
          description: "Gagal memeriksa batas waktu perubahan password.",
        });
        router.push("/protected/settings");
        return;
      }

      // Jika belum pernah update password, boleh langsung
      if (!authLimit) {
        setCanChangePassword(true);
        setIsLoading(false);
        return;
      }

      // Cek sudah berapa hari sejak update terakhir
      const lastUpdate = new Date(authLimit.last_auth_updated_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 7) {
        setCanChangePassword(true);
      } else {
        setCanChangePassword(false);
        setDaysRemaining(7 - diffDays);
      }

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
    const newErrors = {
      newPassword: "",
      confirmPassword: "",
    };

    let isValid = true;

    // Validasi password baru
    if (!formData.newPassword) {
      newErrors.newPassword = "Password baru wajib diisi";
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password minimal 8 karakter";
      isValid = false;
    }

    // Validasi konfirmasi password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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

      const userId = userData.user.id;

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) {
        toast.error("Gagal mengubah password", {
          description: updateError.message,
        });
        setIsSubmitting(false);
        return;
      }

      // Upsert ke user_auth_limit
      const now = new Date().toISOString();

      // Cek apakah record sudah ada
      const { data: existingRecord } = await supabase
        .from("user_auth_limit")
        .select("*")
        .eq("user_id", userId)
        .eq("type", "Password")
        .single();

      if (existingRecord) {
        // Update existing record
        const { error: upsertError } = await supabase
          .from("user_auth_limit")
          .update({
            last_auth_updated_at: now,
          })
          .eq("user_id", userId)
          .eq("type", "Password");

        if (upsertError) {
          console.error("Error updating auth limit:", upsertError);
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("user_auth_limit")
          .insert({
            user_id: userId,
            last_auth_updated_at: now,
            type: "Password",
          });

        if (insertError) {
          console.error("Error inserting auth limit:", insertError);
        }
      }

      toast.success("Password berhasil diubah!", {
        description: "Demi keamanan sesi, silahkan logout dan login kembali.",
        duration: 5000,
      });

      setTimeout(() => {
        router.push("/protected/settings");
      }, 1500);
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti.",
      });
    } finally {
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

  if (!canChangePassword) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
              <CardTitle>Tidak Dapat Mengubah Password</CardTitle>
            </div>
            <CardDescription>
              Anda harus menunggu sebelum dapat mengubah password lagi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full rounded-lg border p-4 bg-amber-500/10 border-amber-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="text-sm text-amber-900 dark:text-amber-100">
                  Password Anda terakhir diubah kurang dari 7 hari yang lalu.
                  Untuk keamanan, Anda perlu menunggu{" "}
                  <strong>{daysRemaining} hari lagi</strong> sebelum dapat
                  mengubah password.
                </div>
              </div>
            </div>
            <Button
              onClick={() => router.push("/protected/settings")}
              className="w-full"
            >
              Kembali ke Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 mt-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <KeyRound className="w-6 h-6 text-green-500" />
            </div>
            <CardTitle>Ganti Password</CardTitle>
          </div>
          <CardDescription>Buat password baru untuk akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative w-full rounded-lg border p-4 bg-blue-500/10 border-blue-500/20">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  Pastikan password Anda minimal 8 karakter dan mudah diingat
                  namun sulit ditebak.
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  placeholder="Masukkan password baru"
                  className={errors.newPassword ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Masukkan ulang password baru"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/protected/settings")}
                disabled={isSubmitting}
                className="flex-1"
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
