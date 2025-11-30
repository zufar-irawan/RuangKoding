import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const getUser = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }
    return data.claims;
}