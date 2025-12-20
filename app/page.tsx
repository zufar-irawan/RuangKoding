import Navbar from "@/components/ui/navigation-bar";
import Footer from "@/components/ui/footer";
import Sidebar from "@/components/ui/sidebar";
import HomePageContent from "@/components/home-page-content";
import TrendingQuestionsSection from "@/components/Questions/trending-questions-section";

export default async function Home() {
  const { data: initialTrendingData } = await TrendingQuestionsSection();

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 w-full mt-16">
        <Sidebar />

        <HomePageContent initialTrendingData={initialTrendingData} />
      </div>

      <Footer />
    </main>
  );
}
