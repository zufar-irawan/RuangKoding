// Type definitions for server actions
// This file contains only types and interfaces, no "use server" directive

import type { Json } from "@/lib/supabase/types";

// AccountActions types
export interface DeleteAccountResult {
  success: boolean;
  error?: string;
}

// FeedbackAction types
export type FeedbackDetailItem = {
  id: number;
  request_id: number;
  user_id: string;
  feedback: Json;
  created_at: string;
  profiles: {
    id: string;
    fullname: string;
    bio: string | null;
    profile_pic: string | null;
    id_dummy: number;
  } | null;
};

export type RequestDetailItem = {
  id: number;
  title: string;
  description: Json | null;
  project_url: string;
  icon_url: string | null;
  user_id: string;
  created_at: string;
  profiles: {
    id: string;
    fullname: string;
    bio: string | null;
    profile_pic: string | null;
    id_dummy: number;
  } | null;
};

// FeedbackRequestAction types
export type UploadProjectIconResult = {
  success: boolean;
  message: string;
  url?: string;
};

export type CreateFeedbackRequestParams = {
  title: string;
  description: Json;
  project_url: string;
  user_id: string;
  icon_url?: string | null;
};

export type CreateFeedbackRequestResult = {
  success: boolean;
  message: string;
  data?: {
    id: number;
    title: string;
  };
};

export type AssociateRequestTagsParams = {
  request_id: number;
  tag_ids: number[];
};

export type AssociateRequestTagsResult = {
  success: boolean;
  message: string;
  successCount?: number;
  errorCount?: number;
};

export type RequestTagsRelation =
  | {
      tag_id: number;
      tags:
        | {
            id: number;
            tag: string | null;
          }
        | {
            id: number;
            tag: string | null;
          }[];
    }
  | {
      tag_id: number;
      tags:
        | {
            id: number;
            tag: string | null;
          }
        | {
            id: number;
            tag: string | null;
          }[];
    }[];

export type FeedbackRequestListItem = {
  id: number;
  title: string;
  description: Json | null;
  project_url: string;
  icon_url: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    fullname: string;
    id_dummy: number;
    profile_pic: string | null;
  } | null;
  vote_count?: number;
  feedback_count?: number;
  request_tags?: RequestTagsRelation;
};

export type GetFeedbackRequestsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type GetFeedbackRequestsResult = {
  success: boolean;
  message: string;
  data?: FeedbackRequestListItem[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
};

export type SearchFeedbackRequestsResult = {
  success: boolean;
  message: string;
  data?: FeedbackRequestListItem[];
};

export type GetFilteredFeedbackRequestsResult = {
  success: boolean;
  message: string;
  data?: FeedbackRequestListItem[];
};

export type GetSavedFeedbackRequestsResult = {
  success: boolean;
  message: string;
  data?: FeedbackRequestListItem[];
  total?: number;
};
