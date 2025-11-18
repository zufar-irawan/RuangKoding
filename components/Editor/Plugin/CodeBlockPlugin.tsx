"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect } from "react";

export function CodeBlockPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const updateCodeBlocks = () => {
            const codeBlocks = document.querySelectorAll('.editor-code');
            codeBlocks.forEach((block) => {
                const textContent = (block.textContent || '').replace(/\n$/, '');
                const lineCount = textContent === '' ? 1 : textContent.split('\n').length;
                const gutter = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');
                (block as HTMLElement).setAttribute('data-gutter', gutter);
            });
        };

        setTimeout(updateCodeBlocks, 100);

        const unregister = editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                setTimeout(updateCodeBlocks, 50);
            });
        });

        const observer = new MutationObserver(() => {
            setTimeout(updateCodeBlocks, 50);
        });

        const editorElement = editor.getRootElement();
        if (editorElement) {
            observer.observe(editorElement, {
                childList: true,
                subtree: true,
                characterData: true,
            });
        }

        return () => {
            unregister();
            observer.disconnect();
        };
    }, [editor]);

    return null;
}
