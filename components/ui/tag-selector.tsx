'use client'

import { useEffect, useState } from "react";
import { TagsType } from "@/lib/type";
import { Input } from "./input";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type TagSelectorProps = {
    value: TagsType[]
    onChange: (next: TagsType[]) => void;
}

export default function TagSelector({ value, onChange }: TagSelectorProps) {
    const [Tags, setTags] = useState<TagsType[] | null>(null);

    useEffect(() => {
        const getTags = async () => {
            const supabase = await createClient();
            const { data: Tags } = await supabase.from('tags').select('*');
            setTags(Tags);

            console.log('Tags fetched:', Tags);
        }

        getTags();
    }, [])

    const [tagsInputValue, setTagsInputValue] = useState('');
    const selectedTags = value
    const setSelectedTags = onChange

    const availableOptions = Tags?.filter(
        (tag) => !selectedTags.find((selected) => selected.id === tag.id)
    )

    const addTag = (tagName: string) => {
        const tagToAdd = Tags?.find(
            (t) => t.tag.toLowerCase() === tagName.toLowerCase()
        )

        if (tagToAdd && !selectedTags.find((t) => t.id === tagToAdd.id)) {
            setSelectedTags([...selectedTags, tagToAdd]);
            setTagsInputValue('');
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(tagsInputValue)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setTagsInputValue(val)

        const exactMatch = availableOptions?.find(
            (opt) => opt.tag.toLowerCase() === val.toLowerCase()
        )

        if (exactMatch) {
            addTag(exactMatch.tag)
        }
    }

    const removeTag = (tagId: number) => {
        setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId))
    }

    return (
        <div className="flex flex-col gap-2">
            <div>
                {selectedTags.length === 0 && (
                    <p className="text-sm text-muted-foreground mb-2">
                        Belum ada tag yang dipilih.
                    </p>
                )}

                {selectedTags.map((tag) => (
                    <span key={tag.id} className="bg-primary flex items-center w-fit text-primary-foreground px-2 py-1 rounded-lg text-sm">
                        {tag.tag}
                        <button
                            className="ml-2 text-xl hover:text-destructive"
                            onClick={() => removeTag(tag.id)}>

                            &times;
                        </button>
                    </span>
                ))}
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
                    placeholder="Cari tag disini..."
                />

                <datalist id="tags-options">
                    {availableOptions?.map((tag) => (
                        <option key={tag.id} value={tag.tag} />
                    ))}
                </datalist>
            </div>

            <p className="mt-2 text-xs text-gray-500">
                Tips: Gunakan panah bawah untuk memilih saran.
            </p>
        </div>

    )
}