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
  searchParams: Promise<{ page?: string }>;
}

export default async function ExplainYourCodePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const result = await getFeedbackRequests({
    page: currentPage,
    limit: 30,
  });

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 w-full mt-16">
        <Sidebar tabs="lautan-feedback" />

        <div className="flex flex-col flex-1 gap-4 py-6 px-8 ml-[22rem]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              Lautan Feedback
            </h1>

            <Link href="/lautan-feedback/create">
              <Button>
                <Plus className="mr-2" size={16} />
                Buat permintaan feedback baru
              </Button>
            </Link>
          </div>

          {/* Watched Tags */}
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <span className="text-muted-foreground">Watched tags:</span>
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
              <div className="flex items-center justify-between">
                <TabsList className="bg-transparent border-0 p-0 h-auto gap-1">
                  <TabsTrigger
                    value="interesting"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md px-3 py-1.5"
                  >
                    Interesting
                  </TabsTrigger>
                  <TabsTrigger
                    value="bountied"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md px-3 py-1.5"
                  >
                    Bountied
                  </TabsTrigger>
                  <TabsTrigger
                    value="hot"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md px-3 py-1.5"
                  >
                    Hot
                  </TabsTrigger>
                  <TabsTrigger
                    value="week"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md px-3 py-1.5"
                  >
                    Week
                  </TabsTrigger>
                  <TabsTrigger
                    value="month"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md px-3 py-1.5"
                  >
                    Month
                  </TabsTrigger>
                </TabsList>

                <Button variant="outline" size="sm" className="gap-2">
                  <Filter size={14} />
                  Filter
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
                    baseUrl="/lautan-feedback"
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
