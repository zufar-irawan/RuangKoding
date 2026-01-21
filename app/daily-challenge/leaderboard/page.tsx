import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeaderboard } from "@/lib/servers/DailyCodeAction";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale";

export default async function LeaderboardPage() {
    const { data, error } = await getLeaderboard()

    if (error) {
        return "Terjadi kendala dalam aplikasi"
    }

    console.log("Berikut list leaerboard ", data)

    return (
        <div className="flex-1 lg:ml-[22rem] p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col mb-4">
                <h1 className="font-bold text-white text-2xl">
                    Leaderboard
                </h1>

                <p>
                    Dibawah ini merupakan List pengguna
                    lain yang sudah menyelesaikan daily
                    code hari ini!
                </p>
            </div>

            <Card className="py-4">
                <CardContent>

                    {data?.map((lb, index) => (
                        <Link href={"/"} key={index}
                            className="flex w-full justify-between px-2 py-4 hover:bg-gray-800 rounded-2xl">
                            <div className="flex gap-2">
                                <p>
                                    {`${index + 1}. `}
                                </p>

                                <p>
                                    {lb.profiles.fullname}
                                </p>
                            </div>

                            <p>
                                {formatDistanceToNow(new Date(lb.created_at), {
                                    addSuffix: true,
                                    locale: id,
                                })}
                            </p>

                        </Link>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}