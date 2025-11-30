import { Search } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";

export default function SearchBar() {
    return (
        <div className="flex flex-1 w-full max-w-[64rem] items-center gap-2 px-5">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    type="text"
                    className="flex-1 bg-background pl-10"
                    placeholder="Cari disini..."
                />
            </div>

            <Button size="icon">
                <Search />
            </Button>
        </div>
    )
}