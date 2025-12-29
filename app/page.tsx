import Navbar from "@/components/ui/navigation-bar";
import Footer from "@/components/ui/footer";
import Sidebar from "@/components/ui/sidebar";
import HomePageContent from "@/components/home-page-content";
import TrendingQuestionsSection from "@/components/Questions/trending-questions-section";
import TrendingFeedbackSection from "@/components/Feedback/trending-feedback-section";
import { DailyReminderModal } from "@/components/daily-reminder";
import { getDailyChallengeStatus } from "@/lib/daily-challenge";

export default async function Home() {
  const { data: initialTrendingData } = await TrendingQuestionsSection();
  const { data: initialFeedbackData } = await TrendingFeedbackSection();
  const dailyChallengeStatus = await getDailyChallengeStatus();

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 w-full mt-16">
        <Sidebar tabs="home" />

        <div className="flex-1 w-full lg:ml-[288px]">
          <HomePageContent
            initialTrendingData={initialTrendingData}
            initialFeedbackData={initialFeedbackData}
            dailyChallengeStatus={dailyChallengeStatus}
          />
        </div>
      </div>

      <Footer />
      <DailyReminderModal initialStatus={dailyChallengeStatus} />
    </main>
  );
}
