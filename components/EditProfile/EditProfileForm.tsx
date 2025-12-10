"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import LinksSection from "./LinksSection";
import {
  updateProfile,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading("Menyimpan perubahan profil...");

    try {
      const formData = new FormData(e.currentTarget);
      const firstname = formData.get("firstname") as string;
      const lastname = formData.get("lastname") as string;
      const motto = formData.get("motto") as string;

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
        />
      </div>

      <SkillsSection initialSkills={initialSkills} onSkillsChange={setSkills} />

      <ExperienceSection
        initialExperiences={initialExperiences}
        onExperiencesChange={setExperiences}
      />

      <LinksSection initialLinks={initialLinks} onLinksChange={setLinks} />

      <div className="flex flex-col gap-2">
        <Button type="submit" variant="default" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
