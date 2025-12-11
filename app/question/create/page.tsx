import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navigation-bar";
import QuestionCreateForm from "@/components/Questions/question-create-form";
import { BackButton } from "@/components/ui/back-button";

export default function QuestionCreate() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 gap-2 mt-16">
        <div className="flex flex-col w-full">
          <div className="ml-10 mt-6">
            <BackButton href="/" label="Kembali" />
          </div>

          <QuestionCreateForm />
        </div>

        <div className="w-px bg-foreground/10 ml-8" aria-hidden></div>

        <aside className="flex flex-col py-5 px-10 gap-2">
          <h1 className="text-2xl text-primary font-bold">
            Tips membuat pertanyaan
          </h1>

          <ul>
            <li>1. Gunakan judul yang jelas dan spesifik.</li>
            <li>2. Jelaskan konteks pertanyaanmu dengan detail.</li>
            <li>3. Sertakan kode atau contoh jika perlu.</li>
            <li>4. Periksa tata bahasa dan ejaan sebelum mengirim.</li>
          </ul>
        </aside>
      </div>

      <Footer />
    </main>
  );
}
