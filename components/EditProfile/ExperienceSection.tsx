"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { format } from "date-fns";

type Experience = {
  organization_name: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  user_id: string;
  created_at: string;
};

type ExperienceSectionProps = {
  initialExperiences?: Experience[];
  onExperiencesChange?: (experiences: Experience[]) => void;
};

export default function ExperienceSection({
  initialExperiences = [],
  onExperiencesChange,
}: ExperienceSectionProps) {
  const [experiences, setExperiences] =
    useState<Experience[]>(initialExperiences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [organizationName, setOrganizationName] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [isCurrently, setIsCurrently] = useState(false);

  const resetForm = () => {
    setOrganizationName("");
    setRole("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setIsCurrently(false);
    setEditingIndex(null);
  };

  const handleOpenModal = (index?: number) => {
    if (index !== undefined) {
      // Edit mode
      const exp = experiences[index];
      setOrganizationName(exp.organization_name);
      setRole(exp.role);
      setStartDate(exp.start_date.split("T")[0]);
      setEndDate(exp.end_date ? exp.end_date.split("T")[0] : "");
      setDescription(exp.description || "");
      setIsCurrently(!exp.end_date);
      setEditingIndex(index);
    } else {
      // Add mode
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSave = () => {
    if (!organizationName.trim() || !role.trim() || !startDate) return;

    const newExperience: Experience = {
      organization_name: organizationName.trim(),
      role: role.trim(),
      start_date: new Date(startDate).toISOString(),
      end_date: isCurrently
        ? null
        : endDate
          ? new Date(endDate).toISOString()
          : null,
      description: description.trim() || null,
      user_id: "",
      created_at: new Date().toISOString(),
    };

    let updatedExperiences: Experience[];

    if (editingIndex !== null) {
      // Edit existing
      updatedExperiences = [...experiences];
      updatedExperiences[editingIndex] = {
        ...experiences[editingIndex],
        ...newExperience,
      };
    } else {
      // Add new
      updatedExperiences = [...experiences, newExperience];
    }

    setExperiences(updatedExperiences);
    onExperiencesChange?.(updatedExperiences);
    handleCloseModal();
  };

  const handleDelete = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    onExperiencesChange?.(updatedExperiences);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sekarang";
    try {
      return format(new Date(dateString), "MMM yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <label className="flex flex-col">
          Pengalaman
          <span className="text-sm text-muted-foreground">
            Tambahkan pengalaman kerja atau organisasi kamu
          </span>
        </label>
        <Button
          type="button"
          size="sm"
          onClick={() => handleOpenModal()}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah
        </Button>
      </div>

      {/* List of experiences */}
      {experiences.length > 0 ? (
        <div className="flex flex-col gap-3 mt-2">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="flex gap-3 p-4 rounded-md border border-input bg-muted/50"
            >
              <div className="flex items-start pt-1">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base">{exp.role}</h4>
                <p className="text-sm text-muted-foreground">
                  {exp.organization_name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                </p>
                {exp.description && (
                  <p className="text-sm mt-2 text-foreground/80">
                    {exp.description}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleOpenModal(index)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
          <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Belum ada pengalaman ditambahkan</p>
        </div>
      )}

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Pengalaman" : "Tambah Pengalaman"}
            </DialogTitle>
            <DialogDescription>
              Isi detail pengalaman kerja atau organisasi kamu
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="organization" className="text-sm font-medium">
                Nama Organisasi / Perusahaan{" "}
                <span className="text-destructive">*</span>
              </label>
              <Input
                id="organization"
                placeholder="e.g. PT Teknologi Indonesia"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Posisi / Role <span className="text-destructive">*</span>
              </label>
              <Input
                id="role"
                placeholder="e.g. Frontend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Tanggal Mulai <span className="text-destructive">*</span>
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  Tanggal Selesai
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isCurrently}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="currently"
                checked={isCurrently}
                onChange={(e) => {
                  setIsCurrently(e.target.checked);
                  if (e.target.checked) setEndDate("");
                }}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="currently" className="text-sm">
                Saya masih bekerja di sini
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Deskripsi (Optional)
              </label>
              <textarea
                id="description"
                placeholder="Ceritakan tentang pekerjaan atau tanggung jawab kamu..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!organizationName.trim() || !role.trim() || !startDate}
            >
              {editingIndex !== null ? "Simpan Perubahan" : "Tambah Pengalaman"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
