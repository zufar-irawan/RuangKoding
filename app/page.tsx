import Navbar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import PostCard from "@/components/post-card";
import Sidebar from "@/components/sidebar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">

        <Navbar />

        <div className="flex flex-1 gap-4 pt-3">
          <PostCard />

          <Sidebar />
        </div>

        <Footer />
      </div>
    </main>
  );
}
