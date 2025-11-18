import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="flex blob haikei min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
