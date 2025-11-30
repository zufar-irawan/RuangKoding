import { Button } from "@/components/ui/button";
import { Share, Link2, ChevronUp, ChevronDown } from "lucide-react";

type Props = {
    votesCount?: number;
}

export default function SharesNVote({ votesCount }: Props) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-6 w-full rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-8 py-6 shadow-sm">
            <div className="flex flex-col gap-3 max-w-xl">
                <p className="text-2xl font-semibold text-foreground">
                    Kenal sepuh yang bisa bantu jawab pertanyaan ini?
                </p>
                <p className="text-sm text-muted-foreground">Bagikan pertanyaan ini supaya mereka bisa bantu kamu.</p>
                <div className="flex items-center gap-4">
                    <Button variant={"default"} size="lg" className="h-11 px-6 text-base">
                        <Share size={18} className="mr-2" />
                        Bagikan
                    </Button>
                    <Button variant={"outline"} size="lg" className="h-11 w-11 p-0">
                        <Link2 size={20} />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-3 items-center justify-center min-w-[220px]">
                <div className="flex flex-col items-center text-center">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Voting
                    </span>
                    <span className="text-base text-muted-foreground">
                        Dorong jawaban lebih cepat
                    </span>
                </div>
                <div className="flex items-center gap-4 border border-foreground/10 rounded-xl bg-background px-5 py-3">
                    <Button variant={"ghost"} size="lg" className="h-11 w-11 p-0">
                        <ChevronUp size={26} />
                    </Button>
                    <span className="text-3xl font-bold min-w-[3ch] text-center">
                        {votesCount}
                    </span>
                    <Button variant={"ghost"} size="lg" className="h-11 w-11 p-0">
                        <ChevronDown size={26} />
                    </Button>
                </div>
            </div>
        </div>
    )
}