import { FileCodeCorner, Newspaper, PlusIcon } from "lucide-react"
import Link from "next/link"

export default function HomeCardButton() {
    return (
        <div className="flex gap-2 w-full">
            <Link href={"#"} className="flex w-full gap-2 border border-foreground/10 rounded-xl px-4 py-5 items-center justify-center">

                <PlusIcon size={40} />

                <div className="flex flex-col">
                    <h1 className="text-md text-gray-50">
                        Bikin pertanyaan baru
                    </h1>

                    <p className="text-gray-500">
                        Malu bertanya sesat dijalan
                    </p>
                </div>
            </Link>

            <Link href={"#"} className="flex w-full gap-2 border border-foreground/10 rounded-xl px-4 py-5 items-center justify-center">

                <FileCodeCorner size={40} />

                <div className="flex flex-col">
                    <h1 className="text-md text-gray-50">
                        Review Kodingan
                    </h1>

                    <p className="text-gray-500">
                        Minta sepuh review kodinganmu
                    </p>
                </div>
            </Link>

            <Link href={"#"} className="flex gap-2 w-full border border-foreground/10 rounded-xl px-4 py-5 items-center justify-center">

                <Newspaper size={40} />

                <div className="flex flex-col">
                    <h1 className="text-md text-gray-50">
                        Tulis Blog
                    </h1>

                    <p className="text-gray-500">
                        Sharing pengalaman ngoding
                    </p>
                </div>
            </Link>
        </div>
    )
}