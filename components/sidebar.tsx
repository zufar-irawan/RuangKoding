import Link from "next/link";
import { BadgeQuestionMark, FileCodeCorner, Newspaper } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="border-l border-foreground/10 max-w-sm h-screen">
            <div className="flex flex-col text-lg">
                <Link href="/question/create"
                    className="border-b border-foreground/10 px-5 py-3 items-center flex gap-3 hover:bg-accent">
                    <BadgeQuestionMark strokeWidth={1.3} size={80} />

                    <div>
                        Bikin pertanyaan baru

                        <p className="text-sm text-gray-500">
                            Malu bertanya sesat dijalan. Apapun masalahnya, kirim kodingannya, dan tanyakan kesini!
                        </p>
                    </div>

                </Link>

                <Link href="/review-kodingan/create"
                    className="border-b border-foreground/10 px-5 py-3 flex items-center gap-3 hover:bg-accent">
                    <FileCodeCorner strokeWidth={1.3} size={80} />

                    <div>
                        Review Kodingan

                        <p className="text-sm text-gray-500">
                            Kirim kodinganmu, dan serahkan pada Reviewer yang udah khatam syntax! Kita nilai sampe akar-akarnya.
                        </p>
                    </div>
                </Link>


                <Link href="/blogs/create"
                    className="border-b border-foreground/10 px-5 py-3 flex items-center gap-3 hover:bg-accent">
                    <Newspaper strokeWidth={1} size={80} />

                    <div>
                        Tulis Blog

                        <p className="text-sm text-gray-500">
                            Punya pengalaman ngoding? Jangan di gatekeep dong, biar junior lain bisa belajar dari sepuh kayak kamu!
                        </p>

                    </div>
                </Link>
            </div>
        </aside>
    )
}