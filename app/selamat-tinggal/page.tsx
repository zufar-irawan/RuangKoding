"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Home, UserX, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

function SelamatTinggal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const deleted = searchParams.get("terhapusselamanya");
    if (deleted === "true") {
      setIsDeleted(true);
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  if (!isDeleted) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background via-muted/20 to-background p-4">
      <div className="w-full max-w-2xl space-y-6 text-center">
        {/* Icon Section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="relative p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full border-2 border-primary/20">
              <UserX className="w-20 h-20 text-primary" />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-2">
          <CardContent className="pt-8 pb-8 px-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Selamat Tinggal
                </h1>
                <p className="text-xl text-muted-foreground">
                  Akun kamu telah berhasil dihapus
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 border-t border-border" />
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div className="flex-1 border-t border-border" />
              </div>

              {/* Message */}
              <div className="space-y-4 text-left max-w-lg mx-auto">
                <p className="text-muted-foreground leading-relaxed">
                  Kami sedih melihat Kamu pergi, tetapi kami menghormati
                  keputusan Kamu. Akun dan semua data Kamu telah dihapus secara
                  permanen dari sistem kami.
                </p>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Yang telah dihapus:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Profil dan informasi pribadi
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Semua pertanyaan dan jawaban
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Komentar dan interaksi
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Riwayat aktivitas dan poin
                    </li>
                  </ul>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Terima kasih telah menjadi bagian dari komunitas RuangKoding.
                  Kontribusi Kamu telah membantu banyak developer lain dalam
                  perjalanan belajar mereka.
                </p>

                <div className="flex items-center justify-center gap-2 p-4 bg-primary/5 rounded-lg">
                  <Heart className="w-5 h-5 text-primary" />
                  <p className="text-sm font-medium">
                    Pintu kami selalu terbuka jika Kamu ingin kembali
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Home className="w-4 h-4 mr-2" />
                    Kembali ke Beranda
                  </Button>
                </Link>
                <Link href="/auth/sign-up" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto">Buat Akun Baru</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <p className="text-sm text-muted-foreground">
          Jika Kamu memiliki masukan atau saran untuk kami,{" "}
          <Link
            href="mailto:support@ruangkoding.com"
            className="text-primary hover:underline"
          >
            hubungi kami
          </Link>
          . Kami senang mendengar dari Anda.
        </p>
      </div>
    </div>
  );
}

export default function SelamatTinggalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SelamatTinggal />
    </Suspense>
  );
}
