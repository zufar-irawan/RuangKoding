"use client";

import { useEffect, useState } from "react";
import { TagsType } from "@/lib/type";
import { Input } from "./input";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type TagSelectorProps = {
  value: TagsType[];
  updateTagsAction: (next: TagsType[]) => void;
};

export default function TagSelector({
  value,
  updateTagsAction,
}: TagSelectorProps) {
  const [Tags, setTags] = useState<TagsType[] | null>(null);
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  useEffect(() => {
    const getTags = async () => {
      const supabase = await createClient();
      const { data: Tags } = await supabase.from("tags").select("*");
      setTags(Tags);

      console.log("Tags fetched:", Tags);
    };

    getTags();
  }, []);

  const [tagsInputValue, setTagsInputValue] = useState("");
  const selectedTags = value;
  const setSelectedTags = updateTagsAction;

  const availableOptions = Tags?.filter(
    (tag) => !selectedTags.find((selected) => selected.id === tag.id),
  );

  // Validasi nama tag
  const validateTagName = (tagName: string): boolean => {
    // Minimal 2 karakter
    if (tagName.length < 2) {
      toast.error("Tag minimal 2 karakter");
      return false;
    }

    // Maksimal 20 karakter
    if (tagName.length > 20) {
      toast.error("Tag maksimal 20 karakter");
      return false;
    }

    // Hanya alfanumerik, spasi, dan beberapa karakter khusus
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(tagName)) {
      toast.error(
        "Tag hanya boleh berisi huruf, angka, spasi, dash, dan underscore",
      );
      return false;
    }

    return true;
  };

  // Fungsi untuk membuat tag baru di database
  const createNewTag = async (tagName: string): Promise<TagsType | null> => {
    try {
      setIsCreatingTag(true);
      const supabase = await createClient();

      // Insert tag baru ke database dengan explicit select
      const { data, error } = await supabase
        .from("tags")
        .insert({ tag: tagName })
        .select("id, tag, created_at")
        .single();

      if (error) {
        console.error("Error creating tag:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        // Check for duplicate tag error
        if (error.code === "23505") {
          toast.error("Tag sudah ada di database");
        } else {
          toast.error(`Gagal membuat tag: ${error.message}`);
        }
        return null;
      }

      // Validasi data yang dikembalikan
      if (!data || !data.id) {
        console.error("Invalid data returned from insert:", data);
        toast.error("Tag dibuat tapi data tidak valid");
        return null;
      }

      toast.success(`Tag "${tagName}" berhasil dibuat!`);

      // Debug: Log struktur tag yang baru dibuat
      console.log("✅ New tag created successfully:", {
        id: data.id,
        tag: data.tag,
        created_at: data.created_at,
      });

      // Update state Tags lokal
      if (Tags) {
        setTags([...Tags, data]);
      } else {
        setTags([data]);
      }

      return data as TagsType;
    } catch (error) {
      console.error("Unexpected error creating tag:", error);
      toast.error("Terjadi kesalahan saat membuat tag");
      return null;
    } finally {
      setIsCreatingTag(false);
    }
  };

  const addTag = async (tagName: string) => {
    // Validasi input kosong
    const trimmedTagName = tagName.trim();
    if (!trimmedTagName) {
      toast.error("Tag tidak boleh kosong");
      return;
    }

    // Validasi format tag
    if (!validateTagName(trimmedTagName)) {
      return;
    }

    // Cek apakah tag sudah dipilih
    const alreadySelected = selectedTags.find(
      (t) => t.tag.toLowerCase() === trimmedTagName.toLowerCase(),
    );
    if (alreadySelected) {
      toast.info("Tag sudah dipilih");
      setTagsInputValue("");
      return;
    }

    // Cari tag di database
    const tagInDb = Tags?.find(
      (t) => t.tag.toLowerCase() === trimmedTagName.toLowerCase(),
    );

    if (tagInDb) {
      // Tag sudah ada di database, langsung tambahkan
      console.log("Adding existing tag:", tagInDb);
      setSelectedTags([...selectedTags, tagInDb]);
      setTagsInputValue("");
      toast.success(`Tag "${tagInDb.tag}" ditambahkan`);
    } else {
      // Tag belum ada, buat tag baru
      console.log("Creating new tag:", trimmedTagName);
      const newTag = await createNewTag(trimmedTagName);
      if (newTag) {
        console.log("New tag added to selection:", newTag);
        setSelectedTags([...selectedTags, newTag]);
        setTagsInputValue("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagsInputValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTagsInputValue(val);

    const exactMatch = availableOptions?.find(
      (opt) => opt.tag.toLowerCase() === val.toLowerCase(),
    );

    if (exactMatch) {
      addTag(exactMatch.tag);
    }
  };

  const removeTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        {selectedTags.length === 0 && (
          <p className="text-sm text-muted-foreground mb-2">
            Belum ada tag yang dipilih.
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="bg-primary flex items-center w-fit text-primary-foreground px-2 py-1 rounded-lg text-sm"
            >
              {tag.tag}
              <button
                className="ml-2 text-xl hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => removeTag(tag.id)}
                disabled={isCreatingTag}
                type="button"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          list="tags-options"
          type="text"
          value={tagsInputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 pl-10"
          placeholder={
            isCreatingTag
              ? "Membuat tag baru..."
              : "Cari tag atau buat tag baru..."
          }
          disabled={isCreatingTag}
        />

        <datalist id="tags-options">
          {availableOptions?.map((tag) => (
            <option key={tag.id} value={tag.tag} />
          ))}
        </datalist>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Tips: Ketik tag dan tekan Enter. Jika tag belum ada, tag baru akan
        dibuat otomatis.
      </p>
    </div>
  );
}
