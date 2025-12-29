import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (showEllipsisStart) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (showEllipsisEnd) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={currentPage === 1}
        className="h-9 w-9 p-0"
      >
        {currentPage === 1 ? (
          <span className="cursor-not-allowed opacity-50">
            <ChevronLeft size={16} />
          </span>
        ) : (
          <Link href={getPageUrl(currentPage - 1)}>
            <ChevronLeft size={16} />
          </Link>
        )}
      </Button>

      {renderPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Button
            key={pageNum}
            variant={isActive ? "default" : "outline"}
            size="sm"
            asChild={!isActive}
            disabled={isActive}
            className="h-9 w-9 p-0"
          >
            {isActive ? (
              <span>{pageNum}</span>
            ) : (
              <Link href={getPageUrl(pageNum)}>{pageNum}</Link>
            )}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={currentPage === totalPages}
        className="h-9 w-9 p-0"
      >
        {currentPage === totalPages ? (
          <span className="cursor-not-allowed opacity-50">
            <ChevronRight size={16} />
          </span>
        ) : (
          <Link href={getPageUrl(currentPage + 1)}>
            <ChevronRight size={16} />
          </Link>
        )}
      </Button>
    </div>
  );
}
