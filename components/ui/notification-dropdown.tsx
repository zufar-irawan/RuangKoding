"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationItem } from "@/components/ui/notification-item";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  type NotificationWithProfile,
} from "@/lib/servers/notificationAction";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<NotificationWithProfile[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    const { data, error } = await getNotifications(10);
    if (error) {
      console.error("Error fetching notifications:", error);
      setIsLoading(false);
      return;
    }
    if (data) {
      // Filter out any malformed notifications
      const validNotifications = data.filter(
        (n) =>
          n &&
          n.id &&
          n.content &&
          n.created_at &&
          n.sender &&
          n.sender.id &&
          n.sender.firstname &&
          n.sender.fullname,
      );
      setNotifications(validNotifications);
    }
    setIsLoading(false);
  };

  const fetchUnreadCount = async () => {
    const { count } = await getUnreadNotificationCount();
    setUnreadCount(count);
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchNotifications();
    }
  };

  const handleNotificationClick = async (
    notificationId: number,
    read: boolean | null,
  ) => {
    if (!read) {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    const { success } = await markAllNotificationsAsRead();
    if (success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between p-4 pb-2">
          <DropdownMenuLabel className="p-0 text-base font-semibold">
            Notifikasi
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-primary hover:text-primary/80 hover:bg-transparent"
              onClick={handleMarkAllAsRead}
            >
              Tandai semua dibaca
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="my-0" />
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Belum ada notifikasi
              </p>
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notification) => {
                // Safety check to ensure notification data is valid
                if (
                  !notification ||
                  !notification.sender ||
                  !notification.sender.firstname
                ) {
                  return null;
                }
                return (
                  <NotificationItem
                    key={notification.id}
                    id={notification.id}
                    content={notification.content}
                    createdAt={notification.created_at}
                    read={notification.read}
                    sender={notification.sender}
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.read,
                      )
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
