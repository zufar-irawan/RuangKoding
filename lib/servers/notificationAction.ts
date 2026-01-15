"use server";

import { createClient } from "@/lib/supabase/server";

interface RawNotificationData {
  id: number;
  content: string;
  created_at: string;
  read: boolean | null;
  reference_id: number | null;
  sender_id: string;
  profiles: {
    id: string;
    firstname: string;
    fullname: string;
    profile_pic: string | null;
  } | null;
}

export interface NotificationWithProfile {
  id: number;
  content: string;
  created_at: string;
  read: boolean | null;
  reference_id: number | null;
  sender: {
    id: string;
    firstname: string;
    fullname: string;
    profile_pic: string | null;
  };
}

export async function getNotifications(limit: number = 10) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "Unauthorized" };
  }

  // console.log("[NotificationAction] Fetching notifications for user:", user.id);

  // Fetch notifications with sender profile
  const { data: rawData, error } = await supabase
    .from("notifications")
    .select(
      `
      id,
      content,
      created_at,
      read,
      reference_id,
      sender_id,
      profiles!notifications_sender_id_fkey (
        id,
        firstname,
        fullname,
        profile_pic
      )
    `,
    )
    .eq("receiver_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<RawNotificationData[]>();

  if (error) {
    console.error("[NotificationAction] Error fetching notifications:", error);
    return { data: null, error: error.message };
  }

  console.log(
    "[NotificationAction] Raw data from Supabase:",
    JSON.stringify(rawData, null, 2),
  );

  // Transform and validate the data
  if (!rawData) {
    console.log("[NotificationAction] No raw data returned");
    return { data: [], error: null };
  }

  const transformedData: NotificationWithProfile[] = rawData
    .filter((item) => {
      const profile = item.profiles;
      return (
        item && profile && profile.id && profile.firstname && profile.fullname
      );
    })
    .map((item) => ({
      id: item.id,
      content: item.content,
      created_at: item.created_at,
      read: item.read,
      reference_id: item.reference_id,
      sender: {
        id: item.profiles!.id,
        firstname: item.profiles!.firstname,
        fullname: item.profiles!.fullname,
        profile_pic: item.profiles!.profile_pic,
      },
    }));

  console.log(
    "[NotificationAction] Transformed data:",
    JSON.stringify(transformedData, null, 2),
  );

  return { data: transformedData, error: null };
}

export async function markNotificationAsRead(notificationId: number) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("receiver_id", user.id);

  if (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("receiver_id", user.id)
    .eq("read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function getUnreadNotificationCount() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { count: 0, error: "Unauthorized" };
  }

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", user.id)
    .eq("read", false);

  if (error) {
    console.error("Error fetching unread count:", error);
    return { count: 0, error: error.message };
  }

  return { count: count || 0, error: null };
}
