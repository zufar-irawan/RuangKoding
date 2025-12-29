import Navbar from "@/components/ui/navigation-bar";
import { BackButton } from "@/components/ui/back-button";
import Footer from "@/components/ui/footer";
import FeedbackRequestForm from "@/components/Feedback/feedback-request-form";

export default function CreateFeedbackReq() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 gap-2 lg:gap-6 mt-16">
        <div className="flex flex-col w-full">
          <div className="ml-4 md:ml-8 lg:ml-10 mt-4 md:mt-6">
            <BackButton href="/" label="Kembali" />
          </div>

          <FeedbackRequestForm />
        </div>

        <div
          className="hidden lg:block w-px bg-foreground/10 ml-8"
          aria-hidden
        ></div>

        <aside className="hidden lg:flex flex-col py-5 px-10 gap-2 min-w-[300px]">
          <h1 className="text-2xl text-primary font-bold">
            Tips meminta feedback
          </h1>

          <ul className="text-sm space-y-2">
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
