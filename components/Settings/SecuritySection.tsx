"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";
import { ChangePasswordModal } from "./ChangePasswordModal";

export function SecuritySection() {
  return (
    <section id="security" className="scroll-mt-20">
      <Card className="border-2 hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Shield className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <CardTitle>Keamanan</CardTitle>
              <CardDescription>
                Kelola password dan keamanan akun Anda
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h3 className="font-medium">Password</h3>
              <p className="text-sm text-muted-foreground">
                Ubah password akun Anda untuk meningkatkan keamanan
              </p>
            </div>
            <ChangePasswordModal />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
