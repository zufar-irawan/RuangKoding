import Navbar from "@/components/ui/navigation-bar";
import Sidebar from "@/components/ui/sidebar";
import Footer from "@/components/ui/footer";
import FilteredQuestions from "@/components/Questions/filtered-questions";
import { getAllTags, getFilteredQuestions } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function QuestionPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = params.search || "";

  const [tagsResult, questionsResult] = await Promise.all([
    getAllTags(),
    getFilteredQuestions(undefined, false, searchQuery),
  ]);

  // Filter out tags with null values
  const allTags = (tagsResult || []).filter(
    (tag): tag is { id: number; tag: string } => tag.tag !== null,
  );
  const { data: initialQuestions } = questionsResult;

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 w-full mt-16">
        <Sidebar tabs="questions" />

        <div className="flex flex-col flex-1 gap-4 md:gap-6 py-4 md:py-6 px-4 md:px-6 lg:px-8 lg:ml-[22rem]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {searchQuery
                  ? `Hasil Pencarian: "${searchQuery}"`
                  : "Semua Pertanyaan"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? `Menampilkan hasil pencarian untuk "${searchQuery}"`
                  : "Jelajahi pertanyaan dari komunitas developer"}
              </p>
            </div>

            <Link href="/question/create" className="w-full md:w-auto">
              <Button className="w-full md:w-auto">
                <Plus className="mr-2" size={16} />
                Buat pertanyaan baru
              </Button>
            </Link>
          </div>

          {/* Filtered Questions Component */}
          <FilteredQuestions
            initialQuestions={initialQuestions || []}
            allTags={allTags}
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
