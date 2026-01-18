import { Suspense } from "react";
import Navbar from "@/components/ui/navigation-bar";
import { parseSlug } from "@/lib/utils";
import Sidebar from "@/components/ui/sidebar";
import { BackButton } from "@/components/ui/back-button";
import RequestContent from "@/components/Feedback/request-content";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { getRequestById } from "@/lib/servers/FeedbackAction";
import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { id: requestId } = parseSlug(slug);

  const request = await getRequestById(Number(requestId));

  if (!request) {
    return {
      title: "Request Not Found - RuangKoding",
    };
  }

  return {
    title: `${request.title} - RuangKoding`,
    description: request.description
      ? String(request.description)
      : request.title,
  };
}

function RequestDetailSkeleton() {
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <Skeleton className="h-10 md:h-12 w-3/4" />
      <Skeleton className="h-5 md:h-6 w-1/2" />
      <div className="flex gap-3 md:gap-4 mt-2">
        <Skeleton className="h-4 md:h-5 w-24 md:w-32" />
        <Skeleton className="h-4 md:h-5 w-24 md:w-32" />
      </div>
      <Skeleton className="h-32 md:h-40 w-full mt-4" />
      <Skeleton className="h-8 md:h-10 w-full mt-6 md:mt-8" />
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

        <div className="flex flex-col flex-1 py-6 md:py-8 lg:py-10 px-4 md:px-6 lg:px-8 lg:ml-[22rem] lg:mr-8">
          <div className="mb-4 md:mb-6">
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
