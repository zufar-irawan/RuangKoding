import Navbar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Questions from "@/components/questions";

export default function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">

        <Navbar />

        <div className="flex flex-1 w-full">
          <Sidebar />

          <div className="flex flex-col flex-1 gap-2 py-3 px-5">

            <div className="w-full justify-end flex">
              <Link href="/question/create">
                <Button>
                  <Plus className="mr-2" size={16} />

                  Buat pertanyaan baru
                </Button>
              </Link>
            </div>

            <Questions />
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
