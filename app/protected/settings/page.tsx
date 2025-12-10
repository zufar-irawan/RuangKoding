"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GetUserProps } from "@/lib/profiles";
import { User, Shield, Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/lib/supabase/types";
import {
  SettingsSidebar,
  SettingsSection,
  AccountSection,
  NotificationSection,
} from "@/components/Settings";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("account");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const sections = ["account", "security", "appearance", "notifications"];
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.push("/auth/login");
        return;
      }

      const { userProfile } = await GetUserProps(data.user.id);
      setUser(userProfile.data);
      setUserId(data.user.id);
      setIsLoading(false);
    };

    loadUser();
  }, [router]);

  useEffect(() => {
    const success = searchParams.get("success");

    if (success === "email_updated") {
      toast.success("Email Berhasil Diperbarui!", {
        description:
          "Email Anda telah berhasil diperbarui. Silakan cek inbox email baru Anda untuk konfirmasi.",
        duration: 5000,
      });

      router.replace("/protected/settings", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash.replace("#", "");
    if (
      hash &&
      ["account", "security", "appearance", "notifications"].includes(hash)
    ) {
      setActiveSection(hash);

      setTimeout(() => {
        scrollToSection(hash);
      }, 100);
    }
  }, []);

  const settingsSections: SettingsSection[] = [
    {
      id: "account",
      title: "Pengaturan Akun",
      description: "Kelola informasi akun dan preferensi pribadi kamu",
      icon: User,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "notifications",
      title: "Notifikasi",
      description: "Atur preferensi notifikasi dan pemberitahuan",
      icon: Bell,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      id: "security",
      title: "Keamanan",
      description: "Password, autentikasi, dan pengaturan keamanan",
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${sectionId}`);
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-background to-muted/20 mt-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Pengaturan
          </h1>
          <p className="text-muted-foreground text-lg">
            Kelola akun dan preferensi kamu
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <SettingsSidebar
            user={user}
            userId={userId}
            sections={settingsSections}
            activeSection={activeSection}
            onSectionClick={scrollToSection}
          />

          <main className="flex-1 space-y-8">
            {/* Account Section */}
            <AccountSection email={user?.email || ""} />

            {/* Notification Section */}
            <NotificationSection userId={userId} />
          </main>
        </div>
      </div>
    </div>
  );
}
