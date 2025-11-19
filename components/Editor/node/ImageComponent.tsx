"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
    $getNodeByKey,
    $getSelection,
    $isNodeSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
    type NodeKey,
} from "lexical";
import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { ImageResizer } from "../ImageResizer";
import { $isImageNode } from "./ImageNode";
import Image from "next/image";

interface ImageComponentProps {
    src: string;
    altText: string;
    width?: number | "inherit";
    height?: number | "inherit";
    nodeKey: NodeKey;
}

export default function ImageComponent({
    src,
    altText,
    width,
    height,
    nodeKey,
}: ImageComponentProps) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);

    const imageRef = useRef<HTMLImageElement | null>(null);

    const onDelete = useCallback(
        (payload: KeyboardEvent) => {
            if (isSelected && $isNodeSelection($getSelection())) {
                payload.preventDefault();
                const node = $getNodeByKey(nodeKey);
                if ($isImageNode(node)) {
                    node.remove();
                }
            }
            return false;
        },
        [isSelected, nodeKey],
    );

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                CLICK_COMMAND,
                (event: MouseEvent) => {
                    const target = event.target as HTMLElement;
                    if (target.tagName === "IMG") {
                        if (event.shiftKey) {
                            clearSelection();
                        } else {
                            setSelected(!isSelected);
                        }
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
            editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
        );
    }, [editor, isSelected, nodeKey, onDelete, clearSelection, setSelected]);

    return (
        <>
            <Image
                ref={imageRef}
                src={src}
                alt={altText}
                width={width === "inherit" ? undefined : width}
                height={height === "inherit" ? undefined : height}
                className={cn(
                    "block h-auto max-w-full rounded-xl border border-transparent shadow-sm",
                    isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                )}
            />

            {isSelected && imageRef.current && (
                <ImageResizer nodeKey={nodeKey} imageRef={imageRef} />
            )}
        </>
    );
}