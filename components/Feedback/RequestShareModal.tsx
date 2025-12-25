"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Send,
  Link2,
  Check,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

interface RequestShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  requestTitle?: string;
}

export function RequestShareModal({
  isOpen,
  onClose,
  requestId,
  requestTitle,
}: RequestShareModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/lautan-feedback/${requestId}`
      : "";

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(
    requestTitle || "Lihat request feedback ini di RuangKoding",
  );

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: Facebook,
      color:
        "hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "hover:bg-sky-500/10 hover:text-sky-500 dark:hover:text-sky-400",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "Instagram",
      icon: Instagram,
      color:
        "hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-400",
      url: "#",
      onClick: () => {
        toast.info("Copy link dan share di Instagram Story atau Post kamu!");
      },
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color:
        "hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-500",
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: Send,
      color:
        "hover:bg-blue-400/10 hover:text-blue-500 dark:hover:text-blue-400",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success("Link berhasil disalin!");

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Gagal menyalin link");
    }
  };

  const handleSocialShare = (platform: (typeof socialPlatforms)[0]) => {
    if (platform.onClick) {
      platform.onClick();
    } else {
      window.open(
        platform.url,
        "_blank",
        "noopener,noreferrer,width=600,height=600",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Share Modal</DialogTitle>
          <DialogDescription>
            Bagikan request feedback ini ke teman-teman kamu
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Social Media Icons */}
          <div>
            <h3 className="text-sm font-medium mb-4">Share this link via</h3>
            <div className="flex items-center justify-center gap-3">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.name}
                    onClick={() => handleSocialShare(platform)}
                    className={`
                      group relative flex items-center justify-center
                      w-14 h-14 rounded-full
                      border-2 border-border
                      bg-background
                      transition-all duration-200
                      hover:scale-110 hover:border-transparent
                      ${platform.color}
                    `}
                    aria-label={`Share on ${platform.name}`}
                  >
                    <Icon
                      size={24}
                      className="transition-transform group-hover:scale-110"
                    />

                    {/* Tooltip */}
                    <span
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2
                      px-2 py-1 bg-foreground text-background text-xs rounded
                      opacity-0 group-hover:opacity-100 transition-opacity
                      whitespace-nowrap pointer-events-none"
                    >
                      {platform.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or copy link
              </span>
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link2
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={shareUrl}
                  readOnly
                  className="pl-10 pr-4 bg-muted/50 border-border font-mono text-sm"
                  onClick={(e) => e.currentTarget.select()}
                />
              </div>
              <Button
                onClick={handleCopyLink}
                size="lg"
                className="px-6 relative overflow-hidden group"
                variant={isCopied ? "default" : "default"}
              >
                {isCopied ? (
                  <>
                    <Check size={18} className="mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} className="mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Siapapun dengan link ini bisa melihat request feedback
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
