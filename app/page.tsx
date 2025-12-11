import Navbar from "@/components/ui/navigation-bar";
import Footer from "@/components/ui/footer";
import Sidebar from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Questions from "@/components/Questions/questions";

export default function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">

        <Navbar />

        <div className="flex flex-1 w-full mt-16">
          <Sidebar />

          <div className="flex flex-col flex-1 gap-2 py-3 pr-5 ml-[22rem]">

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
