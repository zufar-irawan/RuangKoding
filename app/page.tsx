import Navbar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import PostCard from "@/components/post-card";
import Sidebar from "@/components/sidebar";
import HomeCardButton from "@/components/homeCardButton";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">

        <Navbar />

        <div className="flex flex-1 w-[1380px]">
          <Sidebar />

          <div className="flex flex-col gap-2 py-3 px-5">

            <HomeCardButton />

            <PostCard />
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
