"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EditEmailModal } from "@/components/Settings/EditEmailModal";
import { User, Mail, ExternalLink, TextCursorInput } from "lucide-react";
import Link from "next/link";

interface AccountSectionProps {
  email: string;
}

export function AccountSection({ email }: AccountSectionProps) {
  return (
    <section id="account" className="scroll-mt-24">
      <div className="mb-4">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <User className="text-blue-500" size={28} />
          Pengaturan Akun
        </h2>
        <p className="text-muted-foreground mt-1">
          Kelola informasi akun dan preferensi pribadi kamu
        </p>
      </div>

      {/* Informasi Profil */}
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Profil kamu</CardTitle>
          <CardDescription>
            Lengkapi profil kamu agar kami lebih mudah mengenal kamu
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Profile Section */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    Profil kamu
                  </Label>
                  <p className="text-sm text-foreground">
                    Lengkapi dengan informasi kamu
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Profil kamu akan sangat berharga untuk orang lain
                    mempercayai kamu
                  </p>
                </div>

                <Link href="/protected/edit">
                  <Button className="flex" variant={"outline"}>
                    Edit disini
                    <ExternalLink size={24} />
                  </Button>
                </Link>
              </div>

              <div className="flex w-full border-b border-foreground/10 my-4" />

              {/* About Section */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <TextCursorInput
                      size={16}
                      className="text-muted-foreground"
                    />
                    Halaman About
                  </Label>
                  <p className="text-sm text-foreground">
                    Segalanya tentang kamu
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ceritakan sekilas tentang dirimu, misalnya tentang hobi,
                    cita-cita, atau keahlian yang kamu miliki.
                  </p>
                </div>

                <Link href="/protected/about/edit">
                  <Button className="flex" variant={"outline"}>
                    Edit disini
                    <ExternalLink size={24} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informasi Kontak */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Informasi Kontak</CardTitle>
          <CardDescription>
            Perbarui email kamu untuk keamanan akun
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Email Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Mail size={16} className="text-muted-foreground" />
                    Email
                  </Label>
                  <p className="text-sm text-foreground">{email}</p>
                  <p className="text-xs text-muted-foreground">
                    Email digunakan untuk notifikasi penting
                  </p>
                </div>
                <EditEmailModal currentEmail={email} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
