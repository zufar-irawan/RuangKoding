import Navbar from "@/components/ui/navigation-bar";
import Footer from "@/components/ui/footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Navbar />

        <div className="flex-1 flex flex-col w-full">{children}</div>

        <Footer />
      </div>
    </main>
  );
}
