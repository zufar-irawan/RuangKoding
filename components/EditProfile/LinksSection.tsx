"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  X,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
} from "lucide-react";

type UserLink = {
  platform: string | null;
  url: string;
  user_id: string;
  created_at: string;
};

type LinksSectionProps = {
  initialLinks?: UserLink[];
  onLinksChange?: (links: UserLink[]) => void;
};

const SOCIAL_PLATFORMS = [
  {
    name: "twitter",
    label: "Twitter",
    icon: Twitter,
    placeholder: "https://twitter.com/username",
  },
  {
    name: "instagram",
    label: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/username",
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    name: "youtube",
    label: "YouTube",
    icon: Youtube,
    placeholder: "https://youtube.com/@channel",
  },
  {
    name: "github",
    label: "GitHub",
    icon: Github,
    placeholder: "https://github.com/username",
  },
];

export default function LinksSection({
  initialLinks = [],
  onLinksChange,
}: LinksSectionProps) {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [customLinks, setCustomLinks] = useState<UserLink[]>([]);

  // Initialize state from initial links
  useEffect(() => {
    const social: Record<string, string> = {};
    const custom: UserLink[] = [];

    initialLinks.forEach((link) => {
      const platform = link.platform?.toLowerCase();
      if (platform && SOCIAL_PLATFORMS.some((p) => p.name === platform)) {
        social[platform] = link.url;
      } else {
        custom.push(link);
      }
    });

    setSocialLinks(social);
    setCustomLinks(custom);
  }, [initialLinks]);

  // Notify parent component when links change
  useEffect(() => {
    const allLinks: UserLink[] = [
      ...SOCIAL_PLATFORMS.map((platform) => ({
        platform: platform.name,
        url: socialLinks[platform.name] || "",
        user_id: "",
        created_at: new Date().toISOString(),
      })).filter((link) => link.url.trim() !== ""),
      ...customLinks,
    ];
    onLinksChange?.(allLinks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socialLinks, customLinks]);

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleAddCustomLink = () => {
    const newLink: UserLink = {
      platform: null,
      url: "",
      user_id: "",
      created_at: new Date().toISOString(),
    };
    setCustomLinks([...customLinks, newLink]);
  };

  const handleCustomLinkChange = (index: number, value: string) => {
    const updated = [...customLinks];
    updated[index] = {
      ...updated[index],
      url: value,
    };
    setCustomLinks(updated);
  };

  const handleRemoveCustomLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-3">
        <label className="flex flex-col">
          Link Sosial Media & Website
          <span className="text-sm text-muted-foreground">
            Tambahkan link profil sosial media dan website kamu
          </span>
        </label>
      </div>

      {/* Social Media Links */}
      <div className="flex flex-col gap-3">
        {SOCIAL_PLATFORMS.map((platform) => {
          const Icon = platform.icon;
          return (
            <div key={platform.name} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                <label htmlFor={platform.name} className="text-sm font-medium">
                  {platform.label}
                </label>
              </div>
              <Input
                id={platform.name}
                type="url"
                placeholder={platform.placeholder}
                value={socialLinks[platform.name] || ""}
                onChange={(e) =>
                  handleSocialLinkChange(platform.name, e.target.value)
                }
              />
            </div>
          );
        })}
      </div>

      {/* Custom Links */}
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Link Lainnya</label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddCustomLink}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Link
          </Button>
        </div>

        {customLinks.length > 0 && (
          <div className="flex flex-col gap-2">
            {customLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={link.url}
                  onChange={(e) =>
                    handleCustomLinkChange(index, e.target.value)
                  }
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive hover:text-destructive"
                  onClick={() => handleRemoveCustomLink(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
