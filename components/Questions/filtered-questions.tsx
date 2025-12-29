"use client";

import { useState, useEffect } from "react";
import PostCard from "../post-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import type { QuestionListItem } from "@/lib/type";

interface Tag {
  id: number;
  tag: string;
}

interface FilteredQuestionsProps {
  initialQuestions: QuestionListItem[];
  allTags: Tag[];
}

export default function FilteredQuestions({
  initialQuestions,
  allTags,
}: FilteredQuestionsProps) {
  const [questions, setQuestions] =
    useState<QuestionListItem[]>(initialQuestions);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [unansweredOnly, setUnansweredOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filter tags based on search query
  const filteredTags = allTags.filter((tag) =>
    tag.tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Fetch filtered questions
  useEffect(() => {
    const fetchFilteredQuestions = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedTag) params.append("tagId", selectedTag.toString());
        if (unansweredOnly) params.append("unanswered", "true");

        const response = await fetch(
          `/api/filtered-questions?${params.toString()}`,
        );
        const data = await response.json();

        if (data.success && data.data) {
          setQuestions(data.data);
        }
      } catch (error) {
        console.error("Error fetching filtered questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredQuestions();
  }, [selectedTag, unansweredOnly]);

  const handleTagClick = (tagId: number) => {
    if (selectedTag === tagId) {
      setSelectedTag(null); // Deselect if already selected
    } else {
      setSelectedTag(tagId);
    }
  };

  const handleClearFilters = () => {
    setSelectedTag(null);
    setUnansweredOnly(false);
    setSearchQuery("");
  };

  const selectedTagName = allTags.find((tag) => tag.id === selectedTag)?.tag;

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Controls */}
      <div className="flex flex-col gap-4">
        {/* Unanswered Filter Button */}
        <div className="flex items-center gap-3">
          <Button
            variant={unansweredOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setUnansweredOnly(!unansweredOnly)}
          >
            {unansweredOnly ? "Semua Pertanyaan" : "Belum Dijawab"}
          </Button>

          {(selectedTag || unansweredOnly) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="gap-2"
            >
              <X size={14} />
              Hapus Filter
            </Button>
          )}
        </div>

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
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    selectedTag === tag.id
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

      {/* Questions List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {selectedTag || unansweredOnly
              ? "Hasil Filter"
              : "Semua Pertanyaan"}
          </h2>
          <span className="text-sm text-muted-foreground">
            {questions.length} pertanyaan
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="flex-1 rounded-lg border border-dashed border-foreground/20 p-6 text-center text-muted-foreground">
            Tidak ada pertanyaan ditemukan.
          </div>
        ) : (
          <div className="flex flex-col overflow-hidden">
            {questions.map((question) => (
              <PostCard key={question.id} question={question} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
