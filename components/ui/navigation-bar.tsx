import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "@/components/Auth/auth-button";
import { ThemeSwitcher } from "../theme-switcher";
import SearchBar from "./searchbar";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-center border-b border-b-foreground/10 h-16 bg-tertiary z-40">
      <div className="flex w-full justify-between items-center py-3 px-10 text-sm">
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

        <div className="flex flex-1 items-center justify-center">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />

          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
