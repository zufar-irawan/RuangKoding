import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Title Skeleton */}
      <Skeleton className="h-12 w-3/4" />

      {/* User Profile Skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="flex gap-8 mt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Question Body Skeleton */}
      <div className="flex flex-col gap-3 mt-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-4 mt-8">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Divider */}
      <div className="flex border border-foreground/10 w-full mt-6"></div>

      {/* Answers Section Skeleton */}
      <div className="flex flex-col gap-4 mt-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
