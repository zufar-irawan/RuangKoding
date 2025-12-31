"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransition } from "react";
import { completeProfile } from "./action";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import Image from "next/image";

export default function CompleteProfilePage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [defaultValues, setDefaultValues] = useState<{ firstname: string; lastname: string }>({
        firstname: "",
        lastname: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata) {
                // Try to pre-fill from metadata if available (e.g. from Google)
                const fullName = user.user_metadata.full_name || user.user_metadata.name || "";
                const parts = fullName.split(" ");
                if (parts.length > 0) {
                    setDefaultValues({
                        firstname: parts[0],
                        lastname: parts.slice(1).join(" "),
                    });
                }
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await completeProfile(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <Image
                src={'/logo.png'}
                alt="Logo"
                width={250}
                height={250}
            />
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Complete Profile</CardTitle>
                    <CardDescription>
                        Please provide your name to complete your registration.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="firstname">First Name</Label>
                            <Input
                                id="firstname"
                                name="firstname"
                                type="text"
                                placeholder="John"
                                defaultValue={defaultValues.firstname}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastname">Last Name</Label>
                            <Input
                                id="lastname"
                                name="lastname"
                                type="text"
                                placeholder="Doe"
                                defaultValue={defaultValues.lastname}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Saving..." : "Save & Continue"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
