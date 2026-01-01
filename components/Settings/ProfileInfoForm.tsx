"use client";

import { Label } from "@/components/ui/label";
import { ExternalLink, TextCursorInput, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function ProfileInfoForm() {
  return (
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
              Profil kamu akan sangat berharga untuk orang lain mempercayai kamu
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
              <TextCursorInput size={16} className="text-muted-foreground" />
              Halaman About
            </Label>
            <p className="text-sm text-foreground">Segalanya tentang kamu</p>
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
  );
}
