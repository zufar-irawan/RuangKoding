import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="flex flex-col gap-8">
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        Tentang RuangKoding
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Komunitas Pemrograman untuk Masa Depan yang Lebih Mandiri
                    </p>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 mt-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">Visi Kami</h2>
                        <p className="text-lg leading-relaxed">
                            RuangKoding hadir sebagai perantara bagi komunitas programmer yang ingin berkembang bukan hanya sebagai pengguna teknologi, tetapi sebagai pencipta yang memahami fondasi logis di baliknya. Kami percaya bahwa ketergantungan berlebihan pada AI dapat menumpulkan kemampuan berpikir kritis dan problem-solving yang menjadi inti dari seni pemrograman.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">Misi Kami</h2>
                        <ul className="grid gap-4 list-none pl-0">
                            <li className="p-6 border rounded-lg bg-card/50">
                                <h3 className="font-semibold text-lg mb-2">Mengurangi Ketergantungan AI</h3>
                                <p className="text-muted-foreground">Mendorong programmer untuk menulis, memahami, dan men-debug kode mereka sendiri sebelum beralih ke bantuan AI.</p>
                            </li>
                            <li className="p-6 border rounded-lg bg-card/50">
                                <h3 className="font-semibold text-lg mb-2">Kolaborasi Komunitas</h3>
                                <p className="text-muted-foreground">Membangun ekosistem belajar yang saling mendukung, di mana diskusi manusia dinilai lebih tinggi daripada jawaban instan mesin.</p>
                            </li>
                            <li className="p-6 border rounded-lg bg-card/50">
                                <h3 className="font-semibold text-lg mb-2">Penguasaan Fundamental</h3>
                                <p className="text-muted-foreground">Menekankan pentingnya algoritma, struktur data, dan prinsip rekayasa perangkat lunak yang kokoh.</p>
                            </li>
                        </ul>
                    </section>
                </div>

                <div className="flex justify-center mt-12 bg-muted/50 p-8 rounded-xl text-center">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">Bergabunglah Bersama Kami</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Mari kembali ke esensi coding. Asah logika, bangun solusi, dan jadilah programmer yang seutuhnya.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button asChild>
                                <Link href="/auth/sign-up">Mulai Sekarang</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/">Kembali ke Home</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
