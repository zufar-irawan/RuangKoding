"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReportModal from "./report-modal";

type ReportButtonProps = {
  type: "question" | "answer" | "request" | "feedback" | "comment";
  referenceId: number;
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
};

export default function ReportButton({
  type,
  referenceId,
  variant = "ghost",
  size = "sm",
  className,
}: ReportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        <Flag className="h-4 w-4 mr-2" />
        Laporkan
      </Button>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={type}
        referenceId={referenceId}
      />
    </>
  );
}
