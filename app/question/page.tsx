import Navbar from "@/components/ui/navigation-bar";
import Sidebar from "@/components/ui/sidebar";
import Footer from "@/components/ui/footer";
import FilteredQuestions from "@/components/Questions/filtered-questions";
import { getAllTags, getFilteredQuestions } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function QuestionPage() {
  const [tagsResult, questionsResult] = await Promise.all([
    getAllTags(),
    getFilteredQuestions(),
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

        <div className="flex flex-col flex-1 gap-6 py-6 px-8 ml-[22rem]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-foreground">
                Semua Pertanyaan
              </h1>
              <p className="text-sm text-muted-foreground">
                Jelajahi pertanyaan dari komunitas developer
              </p>
            </div>

            <Link href="/question/create">
              <Button>
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
