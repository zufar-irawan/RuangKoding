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
    <section id="account" className="scroll-mt-20 sm:scroll-mt-24">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2">
          <User className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          Pengaturan Akun
        </h2>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
          Kelola informasi akun dan preferensi pribadi kamu
        </p>
      </div>

      {/* Informasi Profil */}
      <Card className="shadow-lg mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Profil kamu</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Lengkapi profil kamu agar kami lebih mudah mengenal kamu
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Profile Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <Label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <User size={14} className="sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                    Profil kamu
                  </Label>
                  <p className="text-xs sm:text-sm text-foreground">
                    Lengkapi dengan informasi kamu
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Profil kamu akan sangat berharga untuk orang lain
                    mempercayai kamu
                  </p>
                </div>

                <Link href="/protected/edit">
                  <Button className="flex text-xs sm:text-sm w-full sm:w-auto" variant={"outline"}>
                    Edit disini
                    <ExternalLink size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </Button>
                </Link>
              </div>

              <div className="flex w-full border-b border-foreground/10 my-3 sm:my-4" />

              {/* About Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <Label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <TextCursorInput
                      size={14}
                      className="sm:w-4 sm:h-4 text-muted-foreground shrink-0"
                    />
                    Halaman About
                  </Label>
                  <p className="text-xs sm:text-sm text-foreground">
                    Segalanya tentang kamu
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Ceritakan sekilas tentang dirimu, misalnya tentang hobi,
                    cita-cita, atau keahlian yang kamu miliki.
                  </p>
                </div>

                <Link href="/protected/about/edit">
                  <Button className="flex text-xs sm:text-sm w-full sm:w-auto" variant={"outline"}>
                    Edit disini
                    <ExternalLink size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informasi Kontak */}
      <Card className="shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Informasi Kontak</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Perbarui email kamu untuk keamanan akun
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Email Section */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <Label className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <Mail size={14} className="sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                    Email
                  </Label>
                  <p className="text-xs sm:text-sm text-foreground break-all">{email}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Email digunakan untuk notifikasi penting
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <EditEmailModal currentEmail={email} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
