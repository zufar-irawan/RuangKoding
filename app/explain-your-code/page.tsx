import Navbar from "@/components/ui/navigation-bar";
import Sidebar from "@/components/ui/sidebar";
import Footer from "@/components/ui/footer";
import ExplainYourCodeContent from "../../components/ExplainYourCode/explain-your-code-content";
import { getExplainRequestHistory } from "@/lib/servers/ExplainYourCodeAction";

export const dynamic = 'force-dynamic';

export default async function ExplainYourCodePage() {
  const historyResult = await getExplainRequestHistory(1, 20);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 w-full mt-16">
        <Sidebar tabs="explain-your-code" />

        <div className="flex flex-col flex-1 gap-4 md:gap-6 py-4 md:py-6 px-4 md:px-6 lg:px-8 lg:ml-[22rem]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Explain Your Code
              </h1>
              <p className="text-sm text-muted-foreground">
                Dapatkan penjelasan mendalam tentang kode Anda dengan bantuan AI
              </p>
            </div>
          </div>

          <ExplainYourCodeContent
            initialHistory={
              historyResult.success ? historyResult.data || [] : []
            }
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
