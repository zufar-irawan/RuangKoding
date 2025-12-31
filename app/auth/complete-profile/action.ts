"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function completeProfile(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/auth/login");
    }

    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const fullname = `${firstname} ${lastname}`.trim();

    if (!firstname || !lastname) {
        return { error: "Name is required" };
    }

    const { error } = await supabase
        .from("profiles")
        .upsert({
            id: user.id,
            email: user.email!,
            firstname,
            lastname,
            fullname,
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/protected");
}
