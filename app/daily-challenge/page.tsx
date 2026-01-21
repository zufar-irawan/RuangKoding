import Navbar from "@/components/ui/navigation-bar";
import Footer from "@/components/ui/footer";
import Sidebar from "@/components/ui/sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Flame, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { ChallengeEditor } from "@/components/daily-reminder/challenge-editor";
import {
  getTodayChallenge,
  getUserSubmission,
  getDailyChallengeStatus,
} from "@/lib/daily-challenge";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Coding Challenge",
};

export default async function DailyChallengePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if not logged in
  if (!user) {
    redirect("/auth/login");
  }

  // Get today's challenge
  const todayChallenge = await getTodayChallenge();

  // Get challenge status for streak
  const challengeStatus = await getDailyChallengeStatus();

  // If no challenge today
  if (!todayChallenge) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <div className="flex w-full mt-16">
          <Sidebar tabs="home" />

          <div className="flex-1 lg:ml-[22rem] p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
                <h1 className="text-3xl font-bold">Daily Coding Challenge</h1>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Tidak ada challenge untuk hari ini. Coba lagi besok!
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  // Get user's submission if exists
  const userSubmission = await getUserSubmission(todayChallenge.id);

  return (
    <div className="flex-1 lg:ml-[22rem] p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto pb-20">
        <ChallengeEditor
          challengeId={todayChallenge.id}
          challenge={todayChallenge.challenge}
          initialSubmission={userSubmission}
          streak={challengeStatus?.streak || 0}
        />
      </div>
    </div>
  );
}
