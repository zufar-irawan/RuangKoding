"use client";

import { useState, useEffect } from "react";
import FeedbackRequestCard from "../feedback-request-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface Tag {
  id: number;
  tag: string;
}

type RequestTagsRelation = {
  tag_id: number;
  tags: {
    id: number;
    tag: string | null;
  } | {
    id: number;
    tag: string | null;
  }[];
} | {
  tag_id: number;
  tags: {
    id: number;
    tag: string | null;
  } | {
    id: number;
    tag: string | null;
  }[];
}[];

interface FeedbackRequest {
  id: number;
  title: string;
  description: unknown;
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
}

interface FilteredFeedbackRequestsProps {
  initialRequests: FeedbackRequest[];
  allTags: Tag[];
}

export default function FilteredFeedbackRequests({
  initialRequests,
  allTags,
}: FilteredFeedbackRequestsProps) {
  const [requests, setRequests] = useState<FeedbackRequest[]>(initialRequests);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filter tags based on search query
  const filteredTags = allTags.filter((tag) =>
    tag.tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Fetch filtered feedback requests
  useEffect(() => {
    const fetchFilteredRequests = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedTag) params.append("tagId", selectedTag.toString());

        const response = await fetch(
          `/api/filtered-feedback-requests?${params.toString()}`,
        );
        const data = await response.json();

        if (data.success && data.data) {
          setRequests(data.data);
        }
      } catch (error) {
        console.error("Error fetching filtered feedback requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredRequests();
  }, [selectedTag]);

  const handleTagClick = (tagId: number) => {
    if (selectedTag === tagId) {
      setSelectedTag(null); // Deselect if already selected
    } else {
      setSelectedTag(tagId);
    }
  };

  const handleClearFilters = () => {
    setSelectedTag(null);
    setSearchQuery("");
  };

  const selectedTagName = allTags.find((tag) => tag.id === selectedTag)?.tag;

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Controls */}
      <div className="flex flex-col gap-4">
        {/* Clear Filters Button */}
        {selectedTag && (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="gap-2"
            >
              <X size={14} />
              Hapus Filter
            </Button>
          </div>
        )}

        {/* Active Filters Display */}
        {selectedTag && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Filter aktif:</span>
            <div className="px-3 py-1 bg-primary text-primary-foreground rounded-md flex items-center gap-2">
              {selectedTagName}
              <button
                onClick={() => setSelectedTag(null)}
                className="hover:bg-primary-foreground/20 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Tags Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Filter berdasarkan Tag
            </h3>
          </div>

          {/* Search Tags */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              type="text"
              placeholder="Cari tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tags Container - Limited to 3 rows */}
          <div
            className="flex flex-wrap gap-2 overflow-y-auto"
            style={{
              maxHeight: "96px", // Approximately 3 rows (32px per row)
            }}
          >
            {filteredTags.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                Tidak ada tag ditemukan
              </span>
            ) : (
              filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.id)}
                  className={`px-3 py-1 rounded text-xs transition-colors ${selectedTag === tag.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground hover:bg-accent/80"
                    }`}
                >
                  {tag.tag}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Feedback Requests List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {selectedTag ? "Hasil Filter" : "Semua Permintaan Feedback"}
          </h2>
          <span className="text-sm text-muted-foreground">
            {requests.length} permintaan
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex-1 rounded-lg border border-dashed border-foreground/20 p-6 text-center text-muted-foreground">
            Tidak ada permintaan feedback ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((request) => (
              <FeedbackRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

