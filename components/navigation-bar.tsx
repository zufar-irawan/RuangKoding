import Link from "next/link"
import Image from "next/image";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "./theme-switcher";

export default function Navbar() {
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="flex w-full justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>
                        <Image
                            src="/logo.png"
                            alt="Ruang Koding Logo"
                            width={170}
                            height={150}
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <ThemeSwitcher />

                    <AuthButton />
                </div>

            </div>
        </nav>
    )
}