"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
  href?: string;
  label?: string;
};

export function BackButton({ href, label = "Kembali" }: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="mb-4 flex items-center gap-2"
    >
      <ArrowLeft size={16} />
      {label}
    </Button>
  );
}
