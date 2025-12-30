"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getNotificationSettings,
  createNotificationSettings,
  updateNotificationSettings,
} from "@/lib/profiles";

interface NotificationSectionProps {
  userId: string;
}

interface NotificationSettings {
  vote: boolean;
  quest_comment: boolean;
  answ_comment: boolean;
  helpful: boolean;
  new_answer: boolean;
}

export function NotificationSection({ userId }: NotificationSectionProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    vote: true,
    quest_comment: true,
    answ_comment: true,
    helpful: true,
    new_answer: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        let data = await getNotificationSettings(userId);

        if (!data) {
          data = await createNotificationSettings(userId);
        }

        setSettings({
          vote: data.vote,
          quest_comment: data.quest_comment,
          answ_comment: data.answ_comment,
          helpful: data.helpful,
          new_answer: data.new_answer,
        });
      } catch (error) {
        console.error("Error loading notification settings:", error);
        toast.error("Gagal memuat pengaturan notifikasi");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [userId]);

  const handleToggle = async (
    key: keyof NotificationSettings,
    value: boolean,
  ) => {
    setIsSaving(key);
    const previousValue = settings[key];

    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    try {
      await updateNotificationSettings(userId, { [key]: value });
      toast.success("Pengaturan notifikasi berhasil diperbarui");
    } catch (error) {
      console.error("Error updating notification settings:", error);
      setSettings((prev) => ({
        ...prev,
        [key]: previousValue,
      }));
      toast.error("Gagal memperbarui pengaturan notifikasi");
    } finally {
      setIsSaving(null);
    }
  };

  const notificationOptions = [
    {
      key: "vote" as keyof NotificationSettings,
      label: "Vote pada Pertanyaan",
      description: "Terima notifikasi ketika pertanyaan kamu mendapat vote",
    },
    {
      key: "quest_comment" as keyof NotificationSettings,
      label: "Komentar pada Pertanyaan",
      description: "Terima notifikasi ketika pertanyaan kamu mendapat komentar",
    },
    {
      key: "answ_comment" as keyof NotificationSettings,
      label: "Komentar pada Jawaban",
      description: "Terima notifikasi ketika jawaban kamu mendapat komentar",
    },
    {
      key: "helpful" as keyof NotificationSettings,
      label: "Jawaban Dianggap Membantu",
      description:
        "Terima notifikasi ketika jawaban kamu ditandai sebagai membantu",
    },
    {
      key: "new_answer" as keyof NotificationSettings,
      label: "Jawaban Baru",
      description: "Terima notifikasi ketika pertanyaan kamu mendapat jawaban",
    },
  ];

  if (isLoading) {
    return (
      <section id="notifications" className="scroll-mt-20 sm:scroll-mt-24">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Bell className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            Notifikasi
          </h2>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            Atur preferensi notifikasi dan pemberitahuan
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section id="notifications" className="scroll-mt-20 sm:scroll-mt-24">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Bell className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          Notifikasi
        </h2>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
          Atur preferensi notifikasi dan pemberitahuan
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Preferensi Notifikasi</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Pilih jenis notifikasi yang ingin kamu terima
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          {notificationOptions.map((option) => (
            <div
              key={option.key}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 py-2 sm:py-3 border-b last:border-b-0"
            >
              <div className="flex-1 space-y-1 min-w-0">
                <Label htmlFor={option.key} className="text-sm sm:text-base font-medium">
                  {option.label}
                </Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isSaving === option.key && (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-muted-foreground" />
                )}
                <Switch
                  id={option.key}
                  checked={settings[option.key]}
                  onCheckedChange={(checked: boolean) =>
                    handleToggle(option.key, checked)
                  }
                  disabled={isSaving === option.key}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
