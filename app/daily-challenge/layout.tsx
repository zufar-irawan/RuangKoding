import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navigation-bar";
import Sidebar from "@/components/ui/sidebar";

export default function DailyChallengeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <div className="flex w-full mt-16">
                <Sidebar tabs="home" />

                {children}
            </div>

            <Footer />
        </main>
    )
}