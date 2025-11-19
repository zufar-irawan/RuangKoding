import Link from "next/link"
import Image from "next/image";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "./theme-switcher";
import SearchBar from "./searchbar";

export default function Navbar() {
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="flex w-[1380px] justify-between items-center py-3 px-5 text-sm">
                <div className="flex gap-5 font-semibold">
                    <Link href={"/"}>
                        <Image
                            src="/logo.png"
                            alt="Ruang Koding Logo"
                            width={170}
                            height={150}
                        />
                    </Link>
                </div>

                <div className="flex flex-1 items-center gap-2">
                    <SearchBar />

                    <ThemeSwitcher />

                    <AuthButton />
                </div>

            </div>
        </nav>
    )
}