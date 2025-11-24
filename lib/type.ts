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

type QuestionTag = {
    tags: {
        tag: string;
    } | null;
};

type AggregateCount = Array<{ count: number } | null> | null;

export interface Question {
    id: number;
    title: string;
    excerpt: string;
    created_at: string;
    view: number;
    profiles: {
        id: string;
        fullname: string;
        bio: string | null;
        profile_pic: string | null;
    };
    quest_tags: QuestionTag[];
    votes: AggregateCount;
    answers: AggregateCount;
}