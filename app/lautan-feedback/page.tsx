import { Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navigation-bar";
import Sidebar from "@/components/ui/sidebar";
import Footer from "@/components/ui/footer";
import FilteredFeedbackRequests from "@/components/Feedback/filtered-feedback-requests";
import { getFilteredFeedbackRequests } from "@/lib/servers/FeedbackRequestAction";
import { getAllTags } from "@/lib/questions";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export const metadata: Metadata = {
  title: "Lautan Feedback",
  description: "Halaman Lautan Feedback RuangKoding",
};

export default async function LautanFeedbackPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = params.search || "";

  const [tagsResult, requestsResult] = await Promise.all([
    getAllTags(),
    getFilteredFeedbackRequests(),
  ]);

  // Filter out tags with null values
  const allTags = (tagsResult || []).filter(
    (tag): tag is { id: number; tag: string } => tag.tag !== null,
  );
  const { data: initialRequests } = requestsResult;

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 w-full mt-16">
        <Sidebar tabs="lautan-feedback" />

        <div className="flex flex-col flex-1 gap-4 md:gap-6 py-4 md:py-6 px-4 md:px-6 lg:px-8 lg:ml-[22rem]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {searchQuery
                  ? `Hasil Pencarian: "${searchQuery}"`
                  : "Lautan Feedback"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? `Menampilkan hasil pencarian untuk "${searchQuery}"`
                  : "Jelajahi permintaan feedback dari komunitas developer"}
              </p>
            </div>

            <Link href="/lautan-feedback/create" className="w-full md:w-auto">
              <Button className="w-full md:w-auto">
                <Plus className="mr-2" size={16} />
                Buat permintaan feedback baru
              </Button>
            </Link>
          </div>

          {/* Filtered Feedback Requests Component */}
          {!requestsResult.success || !initialRequests ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <AlertCircle size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Gagal Mengambil Data
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {requestsResult.message ||
                  "Terjadi kesalahan saat mengambil data"}
              </p>
            </div>
          ) : (
            <FilteredFeedbackRequests
              initialRequests={initialRequests || []}
              allTags={allTags}
            />
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
