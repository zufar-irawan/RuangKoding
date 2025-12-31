import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-4">
                        <div className="flex items-center">
                            <Image
                                src="/logo.png"
                                alt="RuangKoding Logo"
                                width={400}
                                height={200}
                                className="h-[80px] w-[280px]"
                            />

                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            Komunitas pemrograman yang dibangun demi mengurangi ketergantungan dengan AI. Kembali ke esensi logika dan kreativitas manusia.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://www.instagram.com/zufarspace/"
                                target="_blank"
                                rel="noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/zufarirawan/"
                                target="_blank"
                                rel="noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">Platform</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <Link href="/about" className="hover:text-primary transition-colors">
                                        Tentang Kami
                                    </Link>
                                </li>
                                {/* Add more links here if needed */}
                            </ul>
                        </div>

                        {/* Placeholder for other columns if needed */}
                    </div>
                </div>

                <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2024 RuangKoding. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with
                        <a href="https://supabase.com" target="_blank" rel="noreferrer" className="font-medium hover:text-primary transition-colors">Supabase</a>,
                        <a href="https://n8n.io" target="_blank" rel="noreferrer" className="font-medium hover:text-primary transition-colors">n8n</a>,
                        &
                        <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="font-medium hover:text-primary transition-colors">Next.js</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
