import { Plus, Filter, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navigation-bar";
import Sidebar from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/ui/footer";
import FeedbackRequestCard from "@/components/feedback-request-card";
import Pagination from "@/components/pagination";
import { getFeedbackRequests } from "@/lib/servers/FeedbackRequestAction";

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function ExplainYourCodePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || "";

  const result = await getFeedbackRequests({
    page: currentPage,
    limit: 30,
    search: searchQuery,
  });

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 w-full mt-16">
        <Sidebar tabs="lautan-feedback" />

        <div className="flex flex-col flex-1 gap-4 md:gap-6 py-4 md:py-6 px-4 md:px-6 lg:px-8 lg:ml-[22rem]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                {searchQuery
                  ? `Hasil Pencarian: "${searchQuery}"`
                  : "Lautan Feedback"}
              </h1>
              {searchQuery && (
                <p className="text-sm text-muted-foreground">
                  Menampilkan hasil pencarian untuk &quot;{searchQuery}&quot;
                </p>
              )}
            </div>

            <Link href="/lautan-feedback/create" className="w-full md:w-auto">
              <Button className="w-full md:w-auto whitespace-nowrap">
                <Plus className="mr-2" size={16} />
                <span className="hidden sm:inline">
                  Buat permintaan feedback baru
                </span>
                <span className="sm:hidden">Buat Feedback</span>
              </Button>
            </Link>
          </div>

          {/* Watched Tags */}
          <div className="flex items-center gap-2 flex-wrap text-xs md:text-sm">
            <span className="text-muted-foreground hidden sm:inline">
              Watched tags:
            </span>
            <span className="text-muted-foreground sm:hidden">Tags:</span>
            <Link
              href="#"
              className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs hover:bg-accent/80 transition-colors"
            >
              javascript
            </Link>
            <Link
              href="#"
              className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs hover:bg-accent/80 transition-colors"
            >
              css
            </Link>
            <Link
              href="#"
              className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs hover:bg-accent/80 transition-colors"
            >
              react
            </Link>
          </div>

          <div className="flex items-center justify-between border-b border-border pb-3">
            <Tabs defaultValue="interesting" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <TabsList className="bg-transparent border-0 p-0 h-auto gap-1 overflow-x-auto flex-nowrap">
                  <TabsTrigger
                    value="interesting"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Interesting
                  </TabsTrigger>
                  <TabsTrigger
                    value="bountied"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Bountied
                  </TabsTrigger>
                  <TabsTrigger
                    value="hot"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Hot
                  </TabsTrigger>
                  <TabsTrigger
                    value="week"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Week
                  </TabsTrigger>
                  <TabsTrigger
                    value="month"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Month
                  </TabsTrigger>
                </TabsList>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full sm:w-auto"
                >
                  <Filter size={14} />
                  <span className="hidden sm:inline">Filter</span>
                  <span className="sm:hidden">Filter</span>
                </Button>
              </div>
            </Tabs>
          </div>

          {/* Feedback Request List */}
          {!result.success || !result.data || result.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <AlertCircle size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {!result.success ? "Gagal Mengambil Data" : "Belum Ada Data"}
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {!result.success
                  ? result.message
                  : "Belum ada permintaan feedback yang tersedia. Jadilah yang pertama untuk membuat permintaan feedback!"}
              </p>
              {result.success && (
                <Link href="/lautan-feedback/create" className="mt-4">
                  <Button>
                    <Plus className="mr-2" size={16} />
                    Buat Permintaan Feedback
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.data.map((request) => (
                  <FeedbackRequestCard key={request.id} request={request} />
                ))}
              </div>

              {/* Pagination */}
              {result.totalPages && result.totalPages > 1 && (
                <div className="mt-8 mb-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={result.totalPages}
                    baseUrl={
                      searchQuery
                        ? `/lautan-feedback?search=${searchQuery}`
                        : "/lautan-feedback"
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
