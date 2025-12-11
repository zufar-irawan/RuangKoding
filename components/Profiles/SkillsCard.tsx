import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

type Skill = {
  skill_name: string;
  level: string;
};

type SkillsCardProps = {
  skills: Skill[] | null;
};

const levelColors = {
  beginner: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  intermediate: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  expert: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

export default function SkillsCard({ skills }: SkillsCardProps) {
  if (!skills || skills.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Keterampilan</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Belum ada keterampilan yang ditambahkan.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Award className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Keterampilan</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={`px-3 py-1.5 text-sm ${
              levelColors[skill.level.toLowerCase() as keyof typeof levelColors] || "bg-gray-100 text-gray-800"
            }`}
          >
            {skill.skill_name}
            <span className="ml-2 text-xs opacity-75">
              ({skill.level})
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
