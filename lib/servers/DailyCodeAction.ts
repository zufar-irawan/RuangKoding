import { createClient } from "../supabase/server";

export async function getLeaderboard() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("daily_code_user")
        .select(`
            answer,
            penjelasan,
            language,
            profiles (
                id,
                fullname,
                profile_pic
            ),
            created_at
        `)
        .order("created_at", { ascending: false })

    return { data, error }
}