"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  id: number;
  content: string;
  createdAt: string;
  read: boolean | null;
  sender: {
    id: string;
    firstname: string;
    fullname: string;
    profile_pic: string | null;
  };
  onClick?: () => void;
}

export function NotificationItem({
  content,
  createdAt,
  read,
  sender,
  onClick,
}: NotificationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: localeId,
  });

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-3 rounded-md cursor-pointer transition-all duration-200 mb-2 mx-2",
        "hover:bg-accent",
        !read && "bg-accent/50",
      )}
      onClick={onClick}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Avatar className="h-10 w-10 flex-shrink-0">
        {sender.profile_pic ? (
          <AvatarImage src={sender.profile_pic} alt={sender.fullname} />
        ) : null}
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {getInitials(sender.firstname)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          {!read && (
            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
          )}
        </div>
        <p
          className={cn(
            "text-sm transition-all duration-200",
            isExpanded ? "line-clamp-none" : "line-clamp-1",
          )}
        >
          {isExpanded ? content : truncateText(content)}
        </p>
      </div>
    </div>
  );
}
