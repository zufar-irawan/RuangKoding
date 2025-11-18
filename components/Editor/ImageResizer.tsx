"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, type NodeKey } from "lexical";
import { $isImageNode } from "./node/ImageNode";
import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

const Direction = {
    east: 1 << 0,
    north: 1 << 3,
    south: 1 << 1,
    west: 1 << 2,
};

type ResizeState = {
    isResizing: boolean;
    startWidth: number;
    startHeight: number;
    startX: number;
    startY: number;
    direction: number;
    lastWidth: number;
    lastHeight: number;
    aspectRatio: number;
};

const INITIAL_STATE: ResizeState = {
    isResizing: false,
    startWidth: 0,
    startHeight: 0,
    startX: 0,
    startY: 0,
    direction: 0,
    lastWidth: 0,
    lastHeight: 0,
    aspectRatio: 1,
};

export function ImageResizer({
    nodeKey,
    imageRef,
}: {
    nodeKey: NodeKey;
    imageRef: { current: null | HTMLImageElement };
}) {
    const [editor] = useLexicalComposerContext();
    const controlWrapperRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef<ResizeState>({ ...INITIAL_STATE });

    const setNodeDimensions = useCallback(
        (width: number, height: number) => {
            if (!width || !height) return;
            editor.update(() => {
                const node = $getNodeByKey(nodeKey);
                if ($isImageNode(node)) {
                    node.setWidthHeight(Math.round(width), Math.round(height));
                }
            });
        },
        [editor, nodeKey]
    );

    const handlePointerMove = useCallback((event: PointerEvent) => {
        const state = stateRef.current;
        const image = imageRef.current;
        if (!state.isResizing || !image) return;

        const editorRoot = editor.getRootElement();
        const container = editorRoot?.parentElement;
        const viewportWidth = container?.clientWidth ?? window.innerWidth ?? 1200;
        const viewportHeight = window.innerHeight ?? 1200;
        const maxWidth = Math.max(viewportWidth - 16, state.startWidth, 80);
        const maxHeight = Math.max(viewportHeight - 120, state.startHeight, 80);

        const dx = event.clientX - state.startX;
        const dy = event.clientY - state.startY;

        const proposedWidth =
            state.direction & Direction.east
                ? state.startWidth + dx
                : state.direction & Direction.west
                    ? state.startWidth - dx
                    : state.startWidth;

        const proposedHeight =
            state.direction & Direction.south
                ? state.startHeight + dy
                : state.direction & Direction.north
                    ? state.startHeight - dy
                    : state.startHeight;

        const widthDelta = Math.abs(proposedWidth - state.startWidth);
        const heightDelta = Math.abs(proposedHeight - state.startHeight);

        let nextWidth: number;
        let nextHeight: number;

        if (widthDelta >= heightDelta) {
            nextWidth = proposedWidth;
            nextHeight = nextWidth / state.aspectRatio;
        } else {
            nextHeight = proposedHeight;
            nextWidth = nextHeight * state.aspectRatio;
        }

        nextWidth = clamp(nextWidth, 80, maxWidth);
        nextHeight = nextWidth / state.aspectRatio;

        if (nextHeight > maxHeight) {
            nextHeight = clamp(nextHeight, 80, maxHeight);
            nextWidth = nextHeight * state.aspectRatio;
        } else if (nextHeight < 80) {
            nextHeight = 80;
            nextWidth = nextHeight * state.aspectRatio;
        }

        if (nextWidth > maxWidth) {
            nextWidth = clamp(nextWidth, 80, maxWidth);
            nextHeight = nextWidth / state.aspectRatio;
        }

        state.lastWidth = nextWidth;
        state.lastHeight = nextHeight;

        image.style.width = `${nextWidth}px`;
        image.style.height = `${nextHeight}px`;
        controlWrapperRef.current?.classList.add("image-resizer--active");
    }, [editor, imageRef]);

    const handlePointerUp = useCallback(() => {
        const state = stateRef.current;
        if (!state.isResizing) return;
        state.isResizing = false;
        document.removeEventListener("pointermove", handlePointerMoveRef.current);
        document.removeEventListener("pointerup", handlePointerUpRef.current);
        controlWrapperRef.current?.classList.remove("image-resizer--active");
        setNodeDimensions(state.lastWidth || state.startWidth, state.lastHeight || state.startHeight);
        stateRef.current = { ...INITIAL_STATE };
    }, [setNodeDimensions]);

    const handlePointerMoveRef = useRef(handlePointerMove);
    const handlePointerUpRef = useRef(handlePointerUp);
    handlePointerMoveRef.current = handlePointerMove;
    handlePointerUpRef.current = handlePointerUp;

    useEffect(() => {
        return () => {
            document.removeEventListener("pointermove", handlePointerMoveRef.current);
            document.removeEventListener("pointerup", handlePointerUpRef.current);
        };
    }, []);

    const handlePointerDown = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>, dir: number) => {
            const image = imageRef.current;
            if (!image || stateRef.current.isResizing) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const rect = image.getBoundingClientRect();
            const aspectRatio = rect.width / rect.height || 1;
            stateRef.current = {
                isResizing: true,
                startWidth: rect.width,
                startHeight: rect.height,
                startX: event.clientX,
                startY: event.clientY,
                direction: dir,
                lastWidth: rect.width,
                lastHeight: rect.height,
                aspectRatio,
            };

            document.addEventListener("pointermove", handlePointerMoveRef.current);
            document.addEventListener("pointerup", handlePointerUpRef.current);
        },
        [imageRef]
    );

    return (
        <div ref={controlWrapperRef} className="image-resizer">
            <div
                className="image-resizer-handle"
                style={{ cursor: "nwse-resize", left: -5, top: -5 }}
                onPointerDown={(e) => handlePointerDown(e, Direction.north | Direction.west)}
            />
            <div
                className="image-resizer-handle"
                style={{ cursor: "nesw-resize", right: -5, top: -5 }}
                onPointerDown={(e) => handlePointerDown(e, Direction.north | Direction.east)}
            />
            <div
                className="image-resizer-handle"
                style={{ cursor: "nesw-resize", left: -5, bottom: -5 }}
                onPointerDown={(e) => handlePointerDown(e, Direction.south | Direction.west)}
            />
            <div
                className="image-resizer-handle"
                style={{ cursor: "nwse-resize", right: -5, bottom: -5 }}
                onPointerDown={(e) => handlePointerDown(e, Direction.south | Direction.east)}
            />
        </div>
    );
}