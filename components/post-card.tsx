import Link from "next/link";
import { Card, CardContent, CardHeader } from "./ui/card";

export default function PostCard() {
    return (
        <Link href="/protected/posts/1" className="flex-1 px-5 py-3">
            <Card>
                <CardHeader>
                    Apa yang terjadi jika kita belajar coding setiap hari?
                </CardHeader>

                <CardContent>
                    Saya sudah belajar koding hampita setiap hari selama 1 tahun terakhir.
                    Banyak hal yang saya pelajari, mulai dari dasar-dasar pemrograman
                    hingga framework-framework populer seperti React dan Next.js. Saya
                </CardContent>
            </Card>
        </Link>
    )
}