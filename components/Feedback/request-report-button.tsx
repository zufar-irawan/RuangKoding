"use client";

import { useEffect, useState } from "react";
import { getClientUser } from "@/utils/GetClientUser";
import ReportButton from "@/components/Report/report-button";

type RequestReportButtonProps = {
  requestId: number;
  requestUserId: string;
};

export default function RequestReportButton({
  requestId,
  requestUserId,
}: RequestReportButtonProps) {
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const user = await getClientUser();
      setCurrentUser(user);
      setIsLoading(false);
    }
    loadUser();
  }, []);

  if (isLoading || !currentUser || currentUser.id === requestUserId) {
    return null;
  }

  return (
    <ReportButton
      type="request"
      referenceId={requestId}
      variant="ghost"
      size="sm"
    />
  );
}
