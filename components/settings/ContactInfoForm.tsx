"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Mail, Phone } from "lucide-react";
import { EditEmailModal } from "./EditEmailModal";
import { EditPhoneModal } from "./EditPhoneModal";

type Props = {
  currentEmail: string;
  currentPhone?: string | null;
};

export function ContactInfoForm({ currentEmail, currentPhone }: Props) {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSuccess = (text: string) => {
    setMessage({ type: "success", text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleError = (text: string) => {
    setMessage({ type: "error", text });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      )}

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
          <EditEmailModal
            currentEmail={currentEmail}
            SuccessAction={handleSuccess}
            ErrorAction={handleError}
          />
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Phone Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Phone size={16} className="text-muted-foreground" />
              Nomor Telepon
            </Label>
            <p className="text-sm text-foreground">
              {currentPhone || "Belum diatur"}
            </p>
            <p className="text-xs text-muted-foreground">
              Nomor telepon opsional untuk verifikasi tambahan
            </p>
          </div>
          <EditPhoneModal
            currentEmail={currentEmail}
            currentPhone={currentPhone}
            SuccessAction={handleSuccess}
            ErrorAction={handleError}
          />
        </div>
      </div>
    </div>
  );
}
