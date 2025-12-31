import { parseLexicalBodyToHTML } from "@/lib/lexical/lexical-parser";
import styles from "@/styles/BlogContent.module.css";

type BioViewerProps = {
  bioContent: string | null;
};

export default function BioViewer({ bioContent }: BioViewerProps) {
  if (!bioContent) {
    return (
      <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Tentang</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Belum ada bio yang ditambahkan. Klik tombol edit untuk menambahkan bio.
        </p>
      </div>
    );
  }

  const serializedBio =
    typeof bioContent === "string" || typeof bioContent === "object"
      ? (bioContent as string | Record<string, unknown>)
      : null;

  const html = parseLexicalBodyToHTML(serializedBio);

  if (!html) {
    return (
      <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Tentang</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Belum ada bio yang ditambahkan. Klik tombol edit untuk menambahkan bio.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Tentang</h2>
      <article
        className={`w-full mx-auto ${styles["blog-content"]}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
