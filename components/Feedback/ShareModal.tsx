"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  requestTitle?: string;
  requestSlug?: string;
};

export function ShareModal({
  isOpen,
  onClose,
  requestId,
  requestTitle,
  requestSlug,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/lautan-feedback/${requestSlug}-${requestId}`
      : "";

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(
    requestTitle || "Lihat request feedback ini"
  );

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=Lihat request feedback ini: ${encodedUrl}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Gagal menyalin link");
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bagikan Request Feedback</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Bagikan melalui media sosial:
            </p>
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="lg"
                className="flex flex-col items-center gap-2 h-auto py-3"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex flex-col items-center gap-2 h-auto py-3"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-5 w-5 text-sky-500" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex flex-col items-center gap-2 h-auto py-3"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="h-5 w-5 text-blue-700" />
                <span className="text-xs">LinkedIn</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex flex-col items-center gap-2 h-auto py-3"
                onClick={() => handleShare("email")}
              >
                <Mail className="h-5 w-5 text-gray-600" />
                <span className="text-xs">Email</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
