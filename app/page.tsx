import Navbar from "@/components/ui/navigation-bar";
import Footer from "@/components/ui/footer";
import Sidebar from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import Link from "next/link";
import Questions from "@/components/Questions/questions";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 w-full mt-16">
        <Sidebar />

        <div className="flex flex-col flex-1 gap-4 py-6 px-8 ml-[22rem]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              Top questions
            </h1>

            <Link href="/question/create">
              <Button>
                <Plus className="mr-2" size={16} />
                Buat pertanyaan baru
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

          <Questions />
        </div>
      </div>

      <Footer />
    </main>
  );
}
