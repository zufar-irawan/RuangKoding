import UserAvatar from "@/components/UserAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GetUserProps } from "@/lib/profiles";
import { User, Shield, Palette, Bell, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { userProfile } = await GetUserProps(data?.claims?.sub);
  const user = userProfile.data;

  const settingsMenu = [
    {
      title: "Pengaturan Akun",
      description: "Kelola informasi akun dan preferensi pribadi kamu",
      icon: User,
      href: "/protected/settings/account",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Keamanan",
      description: "Password, autentikasi, dan pengaturan keamanan",
      icon: Shield,
      href: "/protected/settings/security",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Tampilan",
      description: "Personalisasi tema dan tampilan aplikasi",
      icon: Palette,
      href: "/protected/settings/appearance",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Notifikasi",
      description: "Atur preferensi notifikasi dan pemberitahuan",
      icon: Bell,
      href: "/protected/settings/notifications",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-background to-muted/20 mt-12">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Pengaturan
          </h1>
          <p className="text-muted-foreground text-lg">
            Kelola akun dan preferensi kamu
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8 border-2 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <UserAvatar
                  profilePic={user?.profile_pic || undefined}
                  fullname={user?.fullname || "User"}
                  userId={data?.claims?.sub || ""}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background"></div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{user?.fullname}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                {user?.motto && (
                  <p className="text-sm text-foreground/70 mt-2 italic">
                    &ldquo;{user.motto}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsMenu.map((menu, index) => {
            const Icon = menu.icon;
            return (
              <Link key={index} href={menu.href}>
                <Card className="h-full transition-all duration-200 hover:shadow-xl hover:scale-[1.02] hover:border-primary/50 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${menu.bgColor} ${menu.color} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon size={24} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                              {menu.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {menu.description}
                            </p>
                          </div>
                          <ChevronRight
                            size={20}
                            className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            Butuh bantuan?{" "}
            <Link
              href="/support"
              className="text-primary hover:underline font-medium"
            >
              Hubungi Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
