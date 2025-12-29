import Navbar from "@/components/ui/navigation-bar";
import Sidebar from "@/components/ui/sidebar";
import Footer from "@/components/ui/footer";
import ExplainYourCodeContent from "../../components/ExplainYourCode/explain-your-code-content";
import { getExplainRequestHistory } from "@/lib/servers/ExplainYourCodeAction";

export default async function ExplainYourCodePage() {
  const historyResult = await getExplainRequestHistory(1, 20);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 w-full mt-16">
        <Sidebar tabs="explain-your-code" />

        <div className="flex flex-col flex-1 gap-2 py-6 px-8 ml-[22rem]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Explain Your Code
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
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
