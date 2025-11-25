'use server'

import { createClient } from "@/lib/supabase/server";

const getQuestions = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("questions")
        .select(`
            id,
            title,
            excerpt,
            created_at,
            profiles (
                id,
                fullname,
                bio,
                profile_pic
            ),
            quest_tags (
                tags (
                    tag
                )
            ),
            view,
            slug,
            votes:quest_vote_question_id_fkey ( count ),
            answers:answers!answers_question_id_fkey ( count )
        `)
        .order("created_at", { ascending: false });

    return { data, error }
}


export { getQuestions };