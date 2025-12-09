import { parseLexicalBodyToHTML } from "@/lib/lexical/lexical-parser";
import styles from "@/styles/BlogContent.module.css";

type BioViewerProps = {
  bioContent: string | null;
};

export default function BioViewer({ bioContent }: BioViewerProps) {
  if (!bioContent) {
    return (
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Tentang Kamu</h2>
        <p className="text-muted-foreground">
          Kamu belum menambahkan informasi tentang dirimu. Klik tombol edit
          untuk mulai menulis.
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
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Tentang Kamu</h2>
        <p className="text-muted-foreground">
          Kamu belum menambahkan informasi tentang dirimu. Klik tombol edit
          untuk mulai menulis.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Tentang Kamu</h2>
      <article
        className={`w-full mx-auto ${styles["blog-content"]}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
