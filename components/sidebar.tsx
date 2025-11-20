import Link from "next/link"
import { CircleQuestionMark, FileCodeCorner, Home, MessageCircleQuestionMark, Newspaper, PlusIcon } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="border-r border-foreground/10 max-w-xs w-full">
            <div className="flex flex-col py-5 w-full">
                <Link href="/question/create"
                    className="ps-5 rounded-e-xl h-14 bg-blue-100/60 items-center flex justify-between gap-3 hover:bg-accent">
                    <div className="flex gap-4">
                        <Home strokeWidth={2} className="text-primary" size={24} />

                        Home
                    </div>

                    <div className="h-full text-primary w-2 rounded-xl bg-primary">.</div>
                </Link>

                <Link href="/review-kodingan/create"
                    className="ps-5 rounded-e-xl h-12 items-center flex justify-between gap-3 hover:bg-accent">
                    <div className="flex gap-4">
                        <MessageCircleQuestionMark strokeWidth={2} className="text-primary" size={24} />

                        Pertanyaan
                    </div>

                    {/* <div className="h-full text-primary w-3 rounded-xl bg-primary">.</div> */}
                </Link>
            </div>
        </aside>
    )
}