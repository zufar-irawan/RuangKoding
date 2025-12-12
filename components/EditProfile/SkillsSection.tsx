"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Skill = {
  skill_name: string;
  level: string;
  user_id: string;
  created_at: string;
  endorsed_count: number | null;
};

type SkillsSectionProps = {
  initialSkills?: Skill[];
  onSkillsChange?: (skills: Skill[]) => void;
};

export default function SkillsSection({
  initialSkills = [],
  onSkillsChange,
}: SkillsSectionProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<string>("Junior");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editSkillName, setEditSkillName] = useState("");
  const [editSkillLevel, setEditSkillLevel] = useState("");

  const handleAddSkill = () => {
    if (newSkillName.trim() === "") return;

    const newSkill: Skill = {
      skill_name: newSkillName.trim(),
      level: newSkillLevel,
      user_id: "",
      created_at: new Date().toISOString(),
      endorsed_count: 0,
    };

    const updatedSkills = [...skills, newSkill];
    setSkills(updatedSkills);
    onSkillsChange?.(updatedSkills);
    setNewSkillName("");
    setNewSkillLevel("Junior");
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    onSkillsChange?.(updatedSkills);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleEditSkill = (index: number) => {
    setEditingIndex(index);
    setEditSkillName(skills[index].skill_name);
    setEditSkillLevel(skills[index].level);
  };

  const handleSaveEdit = (index: number) => {
    if (editSkillName.trim() === "") return;

    const updatedSkills = [...skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      skill_name: editSkillName.trim(),
      level: editSkillLevel,
    };

    setSkills(updatedSkills);
    onSkillsChange?.(updatedSkills);
    setEditingIndex(null);
    setEditSkillName("");
    setEditSkillLevel("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditSkillName("");
    setEditSkillLevel("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleEditKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit(index);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-2">
        <label htmlFor="skills" className="flex flex-col">
          Skills
          <span className="text-sm text-muted-foreground">
            Masukkan skills yang kamu miliki beserta tingkat kemahiranmu
          </span>
        </label>
      </div>

      {/* List of existing skills */}
      {skills.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 rounded-md border border-input bg-muted/50"
            >
              {editingIndex === index ? (
                // Edit mode
                <>
                  <Input
                    value={editSkillName}
                    onChange={(e) => setEditSkillName(e.target.value)}
                    onKeyDown={(e) => handleEditKeyPress(e, index)}
                    className="flex-1"
                    autoFocus
                  />
                  <Select
                    value={editSkillLevel}
                    onValueChange={setEditSkillLevel}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mahir">Mahir</SelectItem>
                      <SelectItem value="Sepuh">Sepuh</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleSaveEdit(index)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                // View mode
                <>
                  <div className="flex-1">
                    <span className="font-medium">{skill.skill_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm px-2 py-1 rounded-md bg-primary/10 text-primary">
                      {skill.level}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditSkill(index)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveSkill(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input for new skill */}
      <div className="flex gap-2">
        <Input
          placeholder="Masukkan nama skill"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />

        <Select value={newSkillLevel} onValueChange={setNewSkillLevel}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Junior">Junior</SelectItem>
            <SelectItem value="Mahir">Mahir</SelectItem>
            <SelectItem value="Sepuh">Sepuh</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          size="icon"
          onClick={handleAddSkill}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
