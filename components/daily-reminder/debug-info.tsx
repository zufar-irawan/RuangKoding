"use client";

import { DailyChallengeStatus } from "@/lib/daily-challenge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DebugInfoProps {
  status: DailyChallengeStatus | null;
}

export function DailyReminderDebugInfo({ status }: DebugInfoProps) {
  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Daily Challenge Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <strong>User Status:</strong>{" "}
          {status ? "✅ Logged In" : "❌ Not Logged In"}
        </div>
        {status && (
          <>
            <div>
              <strong>Streak:</strong> {status.streak} days
            </div>
            <div>
              <strong>Completed Today:</strong>{" "}
              {status.hasCompletedToday ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <strong>Today&apos;s Challenge ID:</strong>{" "}
              {status.todayChallengeId || "None"}
            </div>
            <div>
              <strong>Should Show Modal:</strong>{" "}
              {!status.hasCompletedToday && status.todayChallengeId
                ? "✅ Yes"
                : "❌ No"}
            </div>
            <div>
              <strong>Session Storage:</strong>{" "}
              {typeof window !== "undefined" &&
              sessionStorage.getItem("daily-reminder-shown")
                ? "✅ Already Shown"
                : "❌ Not Shown"}
            </div>
          </>
        )}
        <div className="pt-2 border-t">
          <button
            onClick={() => {
              sessionStorage.removeItem("daily-reminder-shown");
              window.location.reload();
            }}
            className="text-blue-500 hover:underline text-xs"
          >
            Reset & Reload
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
