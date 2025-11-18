"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type MouseEvent } from "react";

import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Code2,
    Image as ImageIcon,
    Table,
    Plus,
    Minus,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link,
} from "lucide-react"
import { cn } from "@/lib/utils";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    type TextFormatType,
    type RangeSelection,
} from "lexical";

import { $createHeadingNode, $isHeadingNode, type HeadingTagType } from "@lexical/rich-text";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { $setBlocksType } from "@lexical/selection";
import { $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";

import { INSERT_IMAGE_COMMAND } from "./ImagePlugin";
import {
    INSERT_TABLE_COMMAND,
    $deleteTableColumnAtSelection,
    $deleteTableRowAtSelection,
    $insertTableColumnAtSelection,
    $insertTableRowAtSelection,
} from "@lexical/table";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";

const blockTypeToBlockName = {
    paragraph: "Normal",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    h6: "Heading 6",
    code: "Code Block",
    bullet: "Bulleted List",
    number: "Numbered List",
} as const;

function getSelectedNode(selection: RangeSelection) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = anchor.getNode();
    const focusNode = focus.getNode();
    if (anchorNode === focusNode) {
        return anchorNode;
    }
    return selection.isBackward() ? anchorNode : focusNode;
}

function sanitizeUrl(url: string) {
    const trimmed = url.trim();
    if (trimmed === "") {
        return "";
    }
    if (/^(https?:)?\/\//i.test(trimmed)) {
        return trimmed;
    }
    return `https://${trimmed}`;
}

export function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isCode, setIsCode] = useState(false);

    const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>("paragraph");
    const [isInsideTable, setIsInsideTable] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [elementFormat, setElementFormat] = useState<"left" | "center" | "right" | "justify">("left");

    const [isLink, setIsLink] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"))
            setIsItalic(selection.hasFormat("italic"))
            setIsUnderline(selection.hasFormat("underline"))
            setIsStrikethrough(selection.hasFormat("strikethrough"))
            setIsCode(selection.hasFormat("code"))

            const anchorNode = selection.anchor.getNode()
            const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow()
            const elementKey = element.getKey()
            const elementDOM = editor.getElementByKey(elementKey)

            if (elementDOM !== null) {
                let nextBlockType: keyof typeof blockTypeToBlockName = "paragraph"
                let insideTable = false

                if ($isHeadingNode(element)) {
                    nextBlockType = element.getTag()
                } else if ($isCodeNode(element)) {
                    nextBlockType = "code"
                } else if ($isListNode(element)) {
                    const type = element.getListType()
                    nextBlockType = type === "bullet" ? "bullet" : "number"
                } else {
                    const parent = element.getParent()
                    if ($isListNode(parent)) {
                        const type = parent.getListType()
                        nextBlockType = type === "bullet" ? "bullet" : "number"
                    } else if (element.getType() === "table" || parent?.getType() === "table") {
                        insideTable = true
                    }
                }

                setBlockType(nextBlockType)
                setIsInsideTable(insideTable)
            } else {
                setIsInsideTable(false)
            }

            if (typeof (element as { getFormatType?: () => string }).getFormatType === 'function') {
                const format = (element as { getFormatType: () => string }).getFormatType() as 'left' | 'center' | 'right' | 'justify' | 'start' | 'end';
                if (format === 'left' || format === 'center' || format === 'right' || format === 'justify') {
                    setElementFormat(format)
                } else {
                    setElementFormat('left')
                }
            } else {
                setElementFormat('left')
            }

            const node = getSelectedNode(selection)
            const parent = node.getParent()
            if ($isLinkNode(node) || $isLinkNode(parent)) {
                setIsLink(true)
            } else {
                setIsLink(false)
            }
        }
        else {
            setIsInsideTable(false)
        }


    }, [editor])

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            })
        })
    }, [editor, updateToolbar])

    const formatBlock = (
        formatType: keyof typeof blockTypeToBlockName
    ) => {
        if (blockType === formatType) return

        editor.focus();
        editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
                if (formatType === "paragraph") {
                    $setBlocksType(selection, () => $createParagraphNode())
                } else if (formatType.startsWith("h")) {
                    $setBlocksType(selection, () => $createHeadingNode(formatType as HeadingTagType))
                } else if (formatType === "code") {
                    $setBlocksType(selection, () => $createCodeNode())
                }
            }
        })

        if (formatType === "bullet") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        } else if (formatType === "number") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }

        setBlockType(formatType)
    }

    const createFormatHandler = useCallback((format: TextFormatType) => {
        return (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
        }
    }, [editor])

    const baseButtonClass = "inline-flex h-9 items-center justify-center rounded-lg px-2 text-sm font-medium text-foreground/80 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
    const activeButtonClass = "bg-primary/10 text-primary ring-1 ring-primary/30";

    const buttons = useMemo(() => ([
        { label: (<Bold size={20} />), format: "bold" as TextFormatType, active: isBold },
        { label: (<Italic size={20} />), format: "italic" as TextFormatType, active: isItalic },
        { label: (<Underline size={20} />), format: "underline" as TextFormatType, active: isUnderline },
        { label: (<Strikethrough size={20} />), format: "strikethrough" as TextFormatType, active: isStrikethrough },
        { label: (<Code size={20} />), format: "code" as TextFormatType, active: isCode },
    ]), [isBold, isItalic, isUnderline, isStrikethrough, isCode])

    const handleImageButtonClick = useCallback(() => {
        fileInputRef.current?.click();
    }, [])

    const handleImageSelected = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (typeof result === "string") {
                editor.focus();
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                    src: result,
                    altText: file.name || "Uploaded image",
                });
            }
        };
        reader.readAsDataURL(file);
        event.target.value = "";
    }, [editor])

    const insertTable = useCallback(() => {
        editor.focus();
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows: "3",
            columns: "3",
        })
    }, [editor])

    const runTableMutation = useCallback((action: "row-before" | "row-after" | "col-before" | "col-after" | "delete-row" | "delete-col") => {
        editor.focus();
        editor.update(() => {
            switch (action) {
                case "row-before":
                    $insertTableRowAtSelection(false);
                    break;
                case "row-after":
                    $insertTableRowAtSelection(true);
                    break;
                case "col-before":
                    $insertTableColumnAtSelection(false);
                    break;
                case "col-after":
                    $insertTableColumnAtSelection(true);
                    break;
                case "delete-row":
                    $deleteTableRowAtSelection();
                    break;
                case "delete-col":
                    $deleteTableColumnAtSelection();
                    break;
            }
        })
    }, [editor])

    const insertLink = useCallback(() => {
        editor.focus();

        if (isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
            return;
        }

        const url = prompt("Enter link URL:") || "";
        const sanitizedUrl = sanitizeUrl(url);
        if (!sanitizedUrl) {
            return;
        }

        editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizedUrl)
    }, [editor, isLink])

    const handleCodeBlockToggle = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        editor.focus();
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                if (blockType === "code") {
                    $setBlocksType(selection, () => $createParagraphNode());
                } else {
                    $setBlocksType(selection, () => $createCodeNode());
                }
            }
        })
    }, [editor, blockType])

    return (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/60 px-3 py-2 text-sm backdrop-blur">
            <select
                value={blockType}
                className="mr-1 h-9 cursor-pointer rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30"
                onChange={(e) => formatBlock(e.target.value as keyof typeof blockTypeToBlockName)}>
                {Object.entries(blockTypeToBlockName).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <button
                type="button"
                onMouseDown={handleCodeBlockToggle}
                aria-label="Toggle code block"
                className={cn(baseButtonClass, "mr-1 px-2", blockType === "code" && activeButtonClass)}
            >
                <Code2 size={18} />
            </button>

            <span className="mx-2 h-6 w-px bg-border/60" />

            {buttons.map(({ label, format, active }) => (
                <button
                    key={format}
                    type="button"
                    onMouseDown={createFormatHandler(format)}
                    aria-label={`Format ${format}`}
                    className={cn(baseButtonClass, "mr-1 px-2", active && activeButtonClass)}
                >
                    {label}
                </button>
            ))}

            <button
                type="button"
                onMouseDown={(event) => {
                    event.preventDefault();
                    insertLink();
                }}
                className={cn(baseButtonClass, "mr-1 px-2", isLink && activeButtonClass)}>
                <Link size={20} />
            </button>

            <span className="mx-2 h-6 w-px bg-border/60" />

            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
                className={cn(baseButtonClass, "mr-1 px-2", elementFormat === 'left' && activeButtonClass)}
                aria-label="Align Left"
            >
                <AlignLeft size={18} />
            </button>

            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
                className={cn(baseButtonClass, "mr-1 px-2", elementFormat === 'center' && activeButtonClass)}
                aria-label="Align Center"
            >
                <AlignCenter size={18} />
            </button>

            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
                className={cn(baseButtonClass, "mr-1 px-2", elementFormat === 'right' && activeButtonClass)}
                aria-label="Align Right"
            >
                <AlignRight size={18} />
            </button>

            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
                className={cn(baseButtonClass, "mr-1 px-2", elementFormat === 'justify' && activeButtonClass)}
                aria-label="Align Justify"
            >
                <AlignJustify size={18} />
            </button>

            <span className="mx-2 h-6 w-px bg-border/60" />

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelected}
            />
            <button
                type="button"
                onMouseDown={(event) => {
                    event.preventDefault();
                    handleImageButtonClick();
                }}
                className={cn(baseButtonClass, "mr-1 px-2")}
            >
                <ImageIcon />
            </button>

            <button
                type="button"
                onMouseDown={(event) => {
                    event.preventDefault();
                    insertTable();
                }}
                className={cn(baseButtonClass, "mr-1 px-2")}
            >
                <Table />
            </button>

            {isInsideTable && (
                <div className="ml-2 flex items-center space-x-1 border-l border-border/60 pl-2">
                    <button
                        type="button"
                        onMouseDown={(event) => {
                            event.preventDefault();
                            runTableMutation("row-before");
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-primary transition hover:bg-card"
                    >
                        <Plus size={14} /> Row↑
                    </button>
                    <button
                        type="button"
                        onMouseDown={(event) => {
                            event.preventDefault();
                            runTableMutation("row-after");
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-primary transition hover:bg-card"
                    >
                        <Plus size={14} /> Row↓
                    </button>
                    <button
                        type="button"
                        onMouseDown={(event) => {
                            event.preventDefault();
                            runTableMutation("col-before");
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-emerald-500 transition hover:bg-card"
                    >
                        <Plus size={14} /> Col←
                    </button>
                    <button
                        type="button"
                        onMouseDown={(event) => {
                            event.preventDefault();
                            runTableMutation("col-after");
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-emerald-500 transition hover:bg-card"
                    >
                        <Plus size={14} /> Col→
                    </button>
                    <button
                        type="button"
                        onMouseDown={(event) => {
                            event.preventDefault();
                            runTableMutation("delete-row");
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-destructive transition hover:bg-card"
                    >
                        <Minus size={14} /> Row
                    </button>
                    <button
                        type="button"
                        onMouseDown={(event) => {
                            event.preventDefault();
                            runTableMutation("delete-col");
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-destructive transition hover:bg-card"
                    >
                        <Minus size={14} /> Col
                    </button>
                </div>
            )}
        </div>
    )
}