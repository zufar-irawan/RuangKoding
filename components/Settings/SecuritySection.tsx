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
    <section id="security" className="scroll-mt-24">
      <div className="mb-4">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="text-green-500" size={28} />
          Keamanan
        </h2>
        <p className="text-muted-foreground mt-1">
          Password, autentikasi, dan pengaturan keamanan
        </p>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Keamanan Akun</CardTitle>
          <CardDescription>
            Kelola password dan autentikasi akun Anda
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Password Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Password</p>
                <p className="text-sm text-muted-foreground">
                  Ubah password akun Anda untuk meningkatkan keamanan
                </p>
              </div>
              <ChangePasswordModal />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="shadow-lg border-destructive/50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
            <Trash2 size={20} />
            Zona Berbahaya
          </CardTitle>
          <CardDescription>
            Tindakan berikut tidak dapat dibatalkan
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium text-destructive">
                  Hapus Akun Permanen
                </p>
                <p className="text-xs text-muted-foreground max-w-xl">
                  Menghapus akun akan menghapus semua data Anda secara permanen,
                  termasuk profil, pertanyaan, jawaban, dan komentar. Tindakan
                  ini tidak dapat dibatalkan.
                </p>
              </div>
              <DeleteAccountModal />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
