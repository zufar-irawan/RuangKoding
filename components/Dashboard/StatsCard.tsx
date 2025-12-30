import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  iconColor?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  iconColor = "text-primary",
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold">{value}</p>
            {description && (
              <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <div
            className={`rounded-full bg-primary/10 p-2 sm:p-3 ${iconColor} shrink-0`}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
