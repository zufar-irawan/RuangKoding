import Link from "next/link"
import { BadgeQuestionMark, FileCodeCorner, Newspaper, PlusIcon } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="border-r border-foreground/10 max-w-sm">
            <div className="flex flex-col">
                <Link href="/question/create"
                    className="px-5 py-3 rounded-s-[30] items-center flex gap-3 hover:bg-accent">
                    <PlusIcon strokeWidth={1.3} size={80} />

                    <div>
                        Bikin pertanyaan baru

                        <p className="text-sm text-gray-500">
                            Malu bertanya sesat dijalan. Kirim kodingannya, dan tanya ke sepuh!
                        </p>
                    </div>

                </Link>

                <Link href="/review-kodingan/create"
                    className="px-5 py-3 rounded-s-[30] flex items-center gap-3 hover:bg-accent">
                    <FileCodeCorner strokeWidth={1.3} size={80} />

                    <div>
                        Review Kodingan

                        <p className="text-sm text-gray-500">
                            Kirim kodinganmu, biar sepuh nilai dari kompleksitasi hingga kerapihan!
                        </p>
                    </div>
                </Link>


                <Link href="/blogs/create"
                    className="px-5 py-3 rounded-s-[30] flex items-center gap-3 hover:bg-accent">
                    <Newspaper strokeWidth={1} size={80} />

                    <div>
                        Tulis Blog

                        <p className="text-sm text-gray-500">
                            Sepuh ngoding? Jangan di gatekeep dong. Tulis aja di blog!
                        </p>

                    </div>
                </Link>
            </div>
        </aside>
    )
}