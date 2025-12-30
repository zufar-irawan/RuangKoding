"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import LinksSection from "./LinksSection";
import {
  updateProfile,
  uploadProfilePicture,
  updateProfilePicture,
  createUserSkill,
  updateUserSkill,
  deleteUserSkill,
  createUserExperience,
  updateUserExperience,
  deleteUserExperience,
  createUserLink,
  updateUserLink,
  deleteUserLink,
} from "@/lib/profiles";

type Skill = {
  skill_name: string;
  level: string;
  user_id: string;
  created_at: string;
  endorsed_count: number | null;
};

type Experience = {
  organization_name: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  user_id: string;
  created_at: string;
};

type UserLink = {
  platform: string | null;
  url: string;
  user_id: string;
  created_at: string;
};

type Profile = {
  firstname: string;
  lastname: string | null;
  motto: string | null;
  bio: string | null;
  profile_pic: string | null;
};

type EditProfileFormProps = {
  basicProfile: Profile;
  initialSkills: Skill[];
  initialExperiences: Experience[];
  initialLinks: UserLink[];
  userId: string;
};

export default function EditProfileForm({
  basicProfile,
  initialSkills,
  initialExperiences,
  initialLinks,
  userId,
}: EditProfileFormProps) {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [experiences, setExperiences] =
    useState<Experience[]>(initialExperiences);
  const [links, setLinks] = useState<UserLink[]>(initialLinks);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar!");
        return;
      }

      // Validasi ukuran file (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 2MB!");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading("Menyimpan perubahan profil...");

    try {
      const formData = new FormData(e.currentTarget);
      const firstname = formData.get("firstname") as string;
      const lastname = formData.get("lastname") as string;
      const motto = formData.get("motto") as string;

      // Upload foto profil jika ada file baru
      if (selectedFile) {
        setIsUploadingPhoto(true);
        try {
          const publicUrl = await uploadProfilePicture(
            userId,
            selectedFile,
            basicProfile?.profile_pic || undefined,
          );
          await updateProfilePicture(userId, publicUrl);
        } catch (error) {
          console.error("Error uploading profile picture:", error);
          toast.error("Gagal mengupload foto profil. Silakan coba lagi.", {
            id: toastId,
          });
          setIsSubmitting(false);
          setIsUploadingPhoto(false);
          return;
        } finally {
          setIsUploadingPhoto(false);
        }
      }

      // Update basic profile
      await updateProfile(userId, {
        firstname,
        lastname: lastname || null,
        motto: motto || null,
      });

      // Detect deleted skills
      for (const initialSkill of initialSkills) {
        const stillExists = skills.find(
          (s) => s.skill_name === initialSkill.skill_name,
        );
        if (!stillExists) {
          await deleteUserSkill(userId, initialSkill.skill_name);
        }
      }

      // Detect new and updated skills
      for (const skill of skills) {
        const existingSkill = initialSkills.find(
          (s) => s.skill_name === skill.skill_name,
        );

        if (!existingSkill) {
          // New skill
          await createUserSkill(userId, skill.skill_name, skill.level);
        } else if (existingSkill.level !== skill.level) {
          // Updated skill
          await updateUserSkill(
            userId,
            skill.skill_name,
            skill.skill_name,
            skill.level,
          );
        }
      }

      // Detect deleted experiences
      for (const initialExp of initialExperiences) {
        const stillExists = experiences.find(
          (e) => e.created_at === initialExp.created_at,
        );
        if (!stillExists) {
          await deleteUserExperience(initialExp.created_at);
        }
      }

      // Detect new and updated experiences
      for (const exp of experiences) {
        const existingExp = initialExperiences.find(
          (e) => e.created_at === exp.created_at,
        );

        if (!existingExp) {
          // New experience
          await createUserExperience({
            userId,
            organizationName: exp.organization_name,
            role: exp.role,
            startDate: exp.start_date,
            endDate: exp.end_date,
            description: exp.description,
          });
        } else {
          // Check if updated
          const hasChanges =
            existingExp.organization_name !== exp.organization_name ||
            existingExp.role !== exp.role ||
            existingExp.start_date !== exp.start_date ||
            existingExp.end_date !== exp.end_date ||
            existingExp.description !== exp.description;

          if (hasChanges) {
            await updateUserExperience(exp.created_at, {
              organizationName: exp.organization_name,
              role: exp.role,
              startDate: exp.start_date,
              endDate: exp.end_date,
              description: exp.description,
            });
          }
        }
      }

      // Detect deleted links
      for (const initialLink of initialLinks) {
        const stillExists = links.find(
          (l) => l.created_at === initialLink.created_at,
        );
        if (!stillExists) {
          await deleteUserLink(initialLink.created_at);
        }
      }

      // Detect new and updated links
      for (const link of links) {
        const existingLink = initialLinks.find(
          (l) => l.created_at === link.created_at,
        );

        if (!existingLink) {
          // New link
          await createUserLink(userId, link.platform, link.url);
        } else {
          // Check if updated
          const hasChanges =
            existingLink.platform !== link.platform ||
            existingLink.url !== link.url;

          if (hasChanges) {
            await updateUserLink(link.created_at, link.platform, link.url);
          }
        }
      }

      toast.success("Profil berhasil diperbarui!", { id: toastId });
      router.push("/protected");
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Gagal memperbarui profil. Silakan coba lagi.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mt-4 w-full max-w-xl"
    >
      {/* Profile Picture Upload Section */}
      <div className="flex flex-col gap-3">
        <Label>Foto Profil</Label>
        <div className="flex items-center gap-4">
          <div className="relative">
            {previewUrl ? (
              <div className="relative">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="rounded-full object-cover w-24 h-24 sm:w-28 sm:h-28 border-2 border-border"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                  disabled={isSubmitting || isUploadingPhoto}
                >
                  <X size={14} />
                </button>
              </div>
            ) : basicProfile?.profile_pic ? (
              <Image
                src={basicProfile.profile_pic}
                alt="Current Profile Picture"
                width={100}
                height={100}
                className="rounded-full object-cover w-24 h-24 sm:w-28 sm:h-28 border-2 border-border"
              />
            ) : (
              <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-secondary/80 text-2xl sm:text-3xl font-semibold text-secondary-foreground border-2 border-border">
                {basicProfile?.firstname?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
              disabled={isSubmitting || isUploadingPhoto}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting || isUploadingPhoto}
              className="w-full sm:w-auto"
            >
              {isUploadingPhoto ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengupload...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {previewUrl || basicProfile?.profile_pic
                    ? "Ganti Foto"
                    : "Upload Foto"}
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Maksimal ukuran file 2MB. Format: JPG, PNG, atau JPEG.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col w-full">
          <label htmlFor="firstname">Nama Depan Kamu</label>
          <Input
            type="text"
            placeholder="Nama Depan Kamu"
            defaultValue={basicProfile?.firstname ?? ""}
            id="firstname"
            name="firstname"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="lastname">Nama Belakang Kamu</label>
          <Input
            type="text"
            placeholder="Nama Belakang Kamu"
            defaultValue={basicProfile?.lastname ?? ""}
            id="lastname"
            name="lastname"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col mb-2">
          <label htmlFor="motto" className="flex flex-col">
            Motto hidup kamu
            <span className="text-sm text-muted-foreground">
              Apa yang memotivasimu terus berkembang di hidup ini?
            </span>
          </label>
        </div>

        <Input
          type="text"
          placeholder="Masukkan Motto kamu disini"
          defaultValue={basicProfile?.motto ?? ""}
          id="motto"
          name="motto"
          disabled={isSubmitting}
        />
      </div>

      <SkillsSection initialSkills={initialSkills} onSkillsChange={setSkills} />

      <ExperienceSection
        initialExperiences={initialExperiences}
        onExperiencesChange={setExperiences}
      />

      <LinksSection initialLinks={initialLinks} onLinksChange={setLinks} />

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          variant="default"
          disabled={isSubmitting || isUploadingPhoto}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting || isUploadingPhoto}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
