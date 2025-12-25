import { Suspense } from "react";
import Navbar from "@/components/ui/navigation-bar";
import { parseSlug } from "@/lib/utils";
import Sidebar from "@/components/ui/sidebar";
import { BackButton } from "@/components/ui/back-button";
import RequestContent from "@/components/Feedback/request-content";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  params: {
    slug: string;
  };
};

function RequestDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <div className="flex gap-4 mt-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-40 w-full mt-4" />
      <Skeleton className="h-10 w-full mt-8" />
    </div>
  );
}

export default async function FeedbackDetailPage({ params }: Props) {
  const { slug } = await params;
  const { id: requestId } = parseSlug(slug);

  return (
    <main className="min-h-screen w-full flex flex-col">
      <Navbar />

      <div className="flex w-full gap-4 mt-16">
        <Sidebar tabs="lautan-feedback" />

        <div className="flex flex-col flex-1 py-10 ml-[22rem] mr-8">
          <div>
            <BackButton href="/lautan-feedback" label="Kembali" />
          </div>

          <Suspense fallback={<RequestDetailSkeleton />}>
            <RequestContent requestId={Number(requestId)} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
