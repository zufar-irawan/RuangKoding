"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Trash2 } from "lucide-react";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { DeleteAccountModal } from "./DeleteAccountModal";

export function SecuritySection() {
  return (
    <section id="security" className="scroll-mt-20 sm:scroll-mt-24">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Shield className="text-green-500 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          Keamanan
        </h2>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
          Password, autentikasi, dan pengaturan keamanan
        </p>
      </div>

      <Card className="shadow-lg mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Keamanan Akun</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Kelola password dan autentikasi akun Anda
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          {/* Password Section */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium">Password</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Ubah password akun Anda untuk meningkatkan keamanan
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <ChangePasswordModal />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="shadow-lg border-destructive/50">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2 text-destructive">
            <Trash2 size={18} className="sm:w-5 sm:h-5" />
            Zona Berbahaya
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Tindakan berikut tidak dapat dibatalkan
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 border border-destructive/50 rounded-lg bg-destructive/5">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-destructive">
                  Hapus Akun Permanen
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Menghapus akun akan menghapus semua data Anda secara permanen,
                  termasuk profil, pertanyaan, jawaban, dan komentar. Tindakan
                  ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <DeleteAccountModal />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
