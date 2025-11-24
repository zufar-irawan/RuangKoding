import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface TagsType {
    id: number;
    tag: string;
    created_at: Timestamp;
}

export interface QuestionsType {
    id: number;
    user_id: string;
    title: string;
    body: JSON
    accepted_answer_id: number | null;
    closed: boolean;
    created_at: Timestamp;
    updated_at: Timestamp;
}