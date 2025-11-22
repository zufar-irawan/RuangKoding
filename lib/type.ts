import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface TagsType {
    id: number;
    tag: string;
    created_at: Timestamp;
}