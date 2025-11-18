"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createImageNode, ImageNode, type ImagePayload } from "../node/ImageNode";
import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand } from "lexical";
import { useEffect } from "react";

export const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>('INSERT_IMAGE_COMMAND')

export function ImagePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([ImageNode])) {
            throw new Error("ImageNode is not registered on this editor");
        }

        return editor.registerCommand(
            INSERT_IMAGE_COMMAND,
            (payload: ImagePayload) => {
                const imageNode = $createImageNode(payload);
                $insertNodes([imageNode]);
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);

    return null;
}