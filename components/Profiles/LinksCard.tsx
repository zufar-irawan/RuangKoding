import { Link as LinkIcon, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type UserLink = {
  platform: string | null;
  url: string;
};

type LinksCardProps = {
  links: UserLink[] | null;
};

export default function LinksCard({ links }: LinksCardProps) {
  if (!links || links.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <LinkIcon className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Link</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Belum ada link yang ditambahkan.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <LinkIcon className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Link</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Badge
              variant="outline"
              className="px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                {link.platform || "Link"}
                <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </span>
            </Badge>
          </a>
        ))}
      </div>
    </div>
  );
}
