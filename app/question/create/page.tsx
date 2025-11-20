import { Editor } from "@/components/Editor/editor";
import Footer from "@/components/footer";
import Navbar from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Undo2 } from "lucide-react";
import Link from "next/link";

export default function QuestionCreate() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1 gap-2">
                <div className="px-10 py-3 flex flex-col flex-1 gap-8">
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center">
                            <Link href="/question" className="hover:bg-foreground/10 p-2 rounded-lg">
                                <Undo2 className="text-primary" size={24} />
                            </Link>

                            <h1 className="text-2xl text-primary font-bold">Tanyakan Pertanyaan!</h1>
                        </div>

                        <p className="text-muted-foreground max-w-xl text-sm">
                            Ajukan pertanyaan kepada para sepuh yang udah khatam kodingan!
                            Dijamin dapet jawaban ga lebih dari satu tahun!
                        </p>
                    </div>

                    <form className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <div className="text-xl font-bold space-y-2">
                                Judul

                                <p className="text-muted-foreground text-sm font-normal">
                                    Buat judul pertanyaanmu yang spesifik!
                                </p>
                            </div>

                            <Input placeholder="Masukkin judulmu yang unik!" />
                        </div>

                        <div className="flex flex-col justify-start">
                            <div className="text-xl font-bold space-y-2">
                                Isi Pertanyaan

                                <p className="text-muted-foreground text-sm font-normal">
                                    Jelaskan secara rinci mengenai pertanyaan yang ingin kamu ajukan.
                                </p>
                            </div>

                            <Editor />
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="text-xl font-bold space-y-2">
                                Tags

                                <p className="text-muted-foreground text-sm font-normal">
                                    Tambahkan beberapa tag yang relevan dengan pertanyaanmu untuk memudahkan pencarian.
                                </p>
                            </div>

                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    type="text"
                                    className="flex-1 pl-10"
                                    placeholder="Cari tag disini..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" variant={"default"}>
                                Kirim, dan tunggu jawabannya!
                            </Button>

                            <Button type="submit" variant={"outline"}>
                                Simpan sebagai draft
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="w-px bg-foreground/10 ml-20" aria-hidden></div>

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
    )
}