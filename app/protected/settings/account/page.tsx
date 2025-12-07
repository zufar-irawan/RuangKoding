import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GetUserProps } from "@/lib/profiles";
import { ContactInfoForm } from "@/components/settings/ContactInfoForm";

export default async function AccountPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { userProfile } = await GetUserProps(data?.claims?.sub);
  const user = userProfile.data;

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-background to-muted/20 mt-12">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Pengaturan Akun
          </h1>
          <p className="text-muted-foreground text-lg">
            Kelola informasi akun dan preferensi pribadi kamu
          </p>
        </div>

        {/* Contact Information Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Informasi Kontak</CardTitle>
            <CardDescription>
              Perbarui email dan nomor telepon kamu untuk keamanan akun
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ContactInfoForm
              currentEmail={user?.email || ""}
              currentPhone={user?.phone}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
