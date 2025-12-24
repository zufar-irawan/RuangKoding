import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { FileText } from "lucide-react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

interface FeedbackRequestCardProps {
  request: {
    id: number;
    title: string;
    description: unknown;
    project_url: string;
    icon_url: string | null;
    created_at: string;
    user_id: string;
    profiles: {
      fullname: string;
    } | null;
  };
}

export default function FeedbackRequestCard({
  request,
}: FeedbackRequestCardProps) {
  const createdAtLabel = formatDistanceToNow(new Date(request.created_at), {
    addSuffix: true,
    locale: id,
  });

  const userProfile = request.profiles;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {userProfile ? (
            <>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/80 text-xs font-semibold text-secondary-foreground">
                {userProfile.fullname.charAt(0).toUpperCase()}
              </span>
              <span className="font-medium text-foreground">
                {userProfile.fullname}
              </span>
            </>
          ) : (
            <span>Pengguna tidak diketahui</span>
          )}
          <span>•</span>
          <span>{createdAtLabel}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          {request.icon_url ? (
            <div className="flex-shrink-0">
              <Image
                src={request.icon_url}
                alt={request.title}
                width={48}
                height={48}
                className="rounded-lg object-cover"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-secondary rounded-lg">
              <FileText size={24} className="text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <Link
              href={`/lautan-feedback/${request.id}`}
              className="text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
            >
              {request.title}
            </Link>

            <Link
              href={request.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-1 inline-block truncate max-w-full"
            >
              {request.project_url}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
