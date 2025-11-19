import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function SearchBar() {
    return (
        <div className="flex flex-1 items-center gap-2 px-5">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    className="flex-1 bg-secondary pl-10"
                    placeholder="Cari disini..."
                />
            </div>

            <Button size="icon">
                <Search />
            </Button>
        </div>
    )
}