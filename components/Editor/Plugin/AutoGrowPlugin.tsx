"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";

interface AutoGrowPluginProps {
    minHeight?: number;
    maxHeight?: number;
}

export function AutoGrowPlugin({ minHeight = 150, maxHeight }: AutoGrowPluginProps = {}) {
    const [editor] = useLexicalComposerContext();
    const rootRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const updateHeight = () => {
            const root = rootRef.current;
            if (!root) {
                return;
            }

            root.style.height = "auto";
            const nextHeight = Math.max(root.scrollHeight, minHeight);
            root.style.height = `${nextHeight}px`;
        };

        const resizeObserver = new ResizeObserver(() => {
            updateHeight();
        });

        const unregisterUpdate = editor.registerUpdateListener(() => {
            updateHeight();
        });

        const unregisterRoot = editor.registerRootListener((nextRootElement, previousRootElement) => {
            if (previousRootElement instanceof HTMLElement) {
                resizeObserver.unobserve(previousRootElement);
            }

            if (nextRootElement instanceof HTMLElement) {
                rootRef.current = nextRootElement;
                nextRootElement.style.overflowY = "hidden";
                nextRootElement.style.minHeight = `${minHeight}px`;
                nextRootElement.style.maxHeight = maxHeight ? `${maxHeight}px` : "none";

                resizeObserver.observe(nextRootElement);
                updateHeight();
            } else {
                rootRef.current = null;
            }
        });

        return () => {
            unregisterUpdate();
            unregisterRoot();
            resizeObserver.disconnect();
        };
    }, [editor, minHeight, maxHeight]);

    return null;
}
