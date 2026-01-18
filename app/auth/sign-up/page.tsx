import { SignUpForm } from "@/components/Auth/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar ke RuangKoding",
};

export default function Page() {
  return (
    <div className="flex blob haikei min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
