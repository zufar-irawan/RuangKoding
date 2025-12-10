"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface PlaceholderSectionProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  cardTitle: string;
  cardDescription: string;
}

export function PlaceholderSection({
  id,
  title,
  description,
  icon: Icon,
  iconColor,
  cardTitle,
  cardDescription,
}: PlaceholderSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Icon className={iconColor} size={28} />
          {title}
        </h2>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="p-8 text-center text-muted-foreground">
            <Icon size={48} className="mx-auto mb-4 opacity-50" />
            <p>Fitur ini akan segera hadir</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
