"use client";

import { useEffect, useState } from "react";
import { getClientUser } from "@/utils/GetClientUser";
import ReportButton from "@/components/Report/report-button";

type QuestionReportButtonProps = {
  questionId: number;
  questionUserId: string;
};

export default function QuestionReportButton({
  questionId,
  questionUserId,
}: QuestionReportButtonProps) {
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

  if (isLoading || !currentUser || currentUser.id === questionUserId) {
    return null;
  }

  return (
    <ReportButton
      type="question"
      referenceId={questionId}
      variant="ghost"
      size="sm"
    />
  );
}
