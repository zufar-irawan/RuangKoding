import { Briefcase, Calendar } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type Experience = {
  organization_name: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
};

type ExperienceCardProps = {
  experiences: Experience[] | null;
};

function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), "MMM yyyy", { locale: id });
  } catch {
    return dateString;
  }
}

function calculateDuration(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (months < 1) return "< 1 bulan";
  if (months < 12) return `${months} bulan`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) return `${years} tahun`;
  return `${years} tahun ${remainingMonths} bulan`;
}

export default function ExperienceCard({ experiences }: ExperienceCardProps) {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Pengalaman</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Belum ada pengalaman yang ditambahkan.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Pengalaman</h2>
      </div>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="relative pl-8 pb-6 border-l-2 border-muted last:border-l-0 last:pb-0"
          >
            <div className="absolute left-2.5 top-2 -translate-x-1/2">
              <div className="h-3 w-3 rounded-full bg-primary" />
            </div>

            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {exp.role}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {exp.organization_name}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(exp.start_date)} -{" "}
                  {exp.end_date ? formatDate(exp.end_date) : "Sekarang"}
                </span>
                <span className="text-xs">
                  · {calculateDuration(exp.start_date, exp.end_date)}
                </span>
              </div>

              {exp.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  {exp.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
