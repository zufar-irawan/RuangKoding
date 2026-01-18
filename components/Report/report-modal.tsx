"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitReport } from "@/lib/servers/ReportAction";

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "question" | "answer" | "request" | "feedback" | "comment";
  referenceId: number;
};

// Kategori dan sub-kategori
const REPORT_CATEGORIES = {
  "security-sensitive": {
    label: "Keamanan & Konten Sensitif",
    reasons: [
      "Konten Seksual atau Telanjang",
      "Kekerasan atau Organisasi Berbahaya",
      "Bunuh Diri atau Melukai Diri Sendiri",
      "Eksploitasi Anak",
    ],
  },
  "behavior-interaction": {
    label: "Perilaku & Interaksi",
    reasons: [
      "Pelecehan atau Perundungan",
      "Ujaran Kebencian",
      "Meniru Identitas Orang Lain",
    ],
  },
  "platform-integrity": {
    label: "Integritas Platform & Spam",
    reasons: ["Spam", "Penipuan atau Scam", "Informasi Palsu"],
  },
  "legality-copyright": {
    label: "Legalitas & Hak Cipta",
    reasons: ["Pelanggaran Hak Cipta", "Barang atau Jasa Ilegal"],
  },
  other: {
    label: "Lainnya",
    reasons: ["Lainnya"],
  },
};

export default function ReportModal({
  isOpen,
  onClose,
  type,
  referenceId,
}: ReportModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!selectedCategory) {
      toast.error("Pilih kategori terlebih dahulu");
      return;
    }

    if (!selectedReason) {
      toast.error("Pilih alasan spesifik terlebih dahulu");
      return;
    }

    // Validasi khusus untuk "Lainnya"
    if (selectedReason === "Lainnya" && !additionalInfo.trim()) {
      toast.error("Informasi tambahan wajib diisi untuk kategori Lainnya");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitReport({
        type,
        reference: referenceId,
        reason: selectedReason,
        additional_info: additionalInfo || null,
      });

      if (result.success) {
        toast.success("Laporan berhasil dikirim");
        handleClose();
      } else {
        toast.error(result.error || "Gagal mengirim laporan");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Terjadi kesalahan saat mengirim laporan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedCategory("");
    setSelectedReason("");
    setAdditionalInfo("");
    onClose();
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedReason(""); // Reset reason saat kategori berubah
    setAdditionalInfo(""); // Reset additional info
  };

  // Get specific reasons based on selected category
  const availableReasons =
    selectedCategory &&
    REPORT_CATEGORIES[selectedCategory as keyof typeof REPORT_CATEGORIES]
      ? REPORT_CATEGORIES[selectedCategory as keyof typeof REPORT_CATEGORIES]
          .reasons
      : [];

  // Check if submit button should be enabled
  const isSubmitDisabled =
    isSubmitting ||
    !selectedCategory ||
    !selectedReason ||
    (selectedReason === "Lainnya" && !additionalInfo.trim());

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] overflow-visible">
        <DialogHeader>
          <DialogTitle>Laporkan Konten</DialogTitle>
          <DialogDescription>
            Bantu kami menjaga komunitas tetap aman dengan melaporkan konten
            yang tidak pantas atau melanggar aturan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Category Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategori Pelaporan</Label>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="z-[200] max-h-[300px]"
              >
                {Object.entries(REPORT_CATEGORIES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Specific Reason Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="reason">Alasan Spesifik</Label>
            <Select
              value={selectedReason}
              onValueChange={setSelectedReason}
              disabled={!selectedCategory}
            >
              <SelectTrigger id="reason" disabled={!selectedCategory}>
                <SelectValue
                  placeholder={
                    selectedCategory
                      ? "Pilih alasan"
                      : "Pilih kategori terlebih dahulu"
                  }
                />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="z-[200] max-h-[300px]"
              >
                {availableReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Info - Wajib untuk Lainnya */}
          {selectedReason === "Lainnya" && (
            <div className="space-y-2">
              <Label htmlFor="additional-info">
                Informasi Tambahan <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="additional-info"
                placeholder="Jelaskan lebih detail tentang masalah yang kamu laporkan..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={4}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                Field ini wajib diisi untuk kategori Lainnya
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
