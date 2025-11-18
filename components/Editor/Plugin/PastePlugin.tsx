"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_LOW, PASTE_COMMAND } from "lexical";
import { useEffect } from "react";

import { INSERT_IMAGE_COMMAND } from "./ImagePlugin";

export function PastePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            PASTE_COMMAND,
            (event: ClipboardEvent) => {
                const clipboardData = event.clipboardData;
                if (!clipboardData) {
                    return false;
                }

                const files = Array.from(clipboardData.files);

                const imageFile = files.find((file) => file.type.startsWith("image/"));

                if (imageFile) {
                    event.preventDefault();

                    const reader = new FileReader();
                    reader.onload = () => {
                        const dataURL = reader.result as string;
                        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                            src: dataURL,
                            altText: "Pasted image",
                        });
                    };
                    reader.readAsDataURL(imageFile);

                    return true;
                }

                return false;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor]);

    return null;
}