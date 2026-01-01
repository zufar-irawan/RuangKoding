"use client";

import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { EditEmailModal } from "@/components/Settings/EditEmailModal";

type Props = {
  currentEmail: string;
};

export function ContactInfoForm({ currentEmail }: Props) {
  return (
    <div className="space-y-6">
      {/* Email Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail size={16} className="text-muted-foreground" />
              Email
            </Label>
            <p className="text-sm text-foreground">{currentEmail}</p>
            <p className="text-xs text-muted-foreground">
              Email digunakan untuk notifikasi penting
            </p>
          </div>
          <EditEmailModal currentEmail={currentEmail} />
        </div>
      </div>
    </div>
  );
}
