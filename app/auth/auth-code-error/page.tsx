import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function AuthCodeErrorPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const errorDescription = params.error_description as string | undefined;
    const isMultipleAccountsError = errorDescription?.includes("Multiple accounts");

    return (
        <div className="flex h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl text-red-600">
                        Authentication Error
                    </CardTitle>
                    <CardDescription>
                        Terjadi masalah saat mencoba masuk.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        {isMultipleAccountsError ? (
                            <p>
                                Akun dengan email ini sudah terdaftar menggunakan metode lain
                                (misalnya email/password). Silakan masuk menggunakan metode yang
                                Anda gunakan sebelumnya, atau hubungi support jika Anda mengalami
                                kendala.
                            </p>
                        ) : (
                            <p>
                                {errorDescription || "Terjadi kesalahan yang tidak diketahui."}
                            </p>
                        )}
                        {process.env.NODE_ENV === "development" && (
                            <div className="mt-4 rounded-md bg-slate-100 p-2 text-xs font-mono text-slate-800">
                                <p>Debug Info:</p>
                                <p>Code: {params.error_code}</p>
                                <p>Error: {params.error}</p>
                                <p>Description: {params.error_description}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    {isMultipleAccountsError && (
                        <Button asChild className="w-full" variant="default">
                            <Link href="mailto:irawanrafidzufar@gmail.com?subject=Login%20Issue:%20Multiple%20Accounts">
                                Hubungi Support
                            </Link>
                        </Button>
                    )}
                    <Button asChild className="w-full" variant="outline">
                        <Link href="/auth/login">Kembali ke Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
