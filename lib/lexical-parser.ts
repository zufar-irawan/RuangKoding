import "server-only";
import { JSDOM } from "jsdom";
import { createHeadlessEditor } from "@lexical/headless";
import { $generateHtmlFromNodes } from "@lexical/html";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { TableNode, TableRowNode, TableCellNode } from "@lexical/table";
import {
    ElementNode,
    type NodeKey,
    type SerializedLexicalNode,
    type Spread,
    type SerializedEditorState,
    type SerializedElementNode,
} from "lexical";

type SerializedServerImageNode = Spread<
    {
        type: "image";
        altText: string;
        src: string;
        width?: number | "inherit";
        height?: number | "inherit";
        key?: NodeKey;
        version: 1;
    },
    SerializedElementNode<SerializedLexicalNode>
>;

class ServerImageNode extends ElementNode {
    __src: string;
    __altText: string;
    __width: number | "inherit";
    __height: number | "inherit";

    static getType(): string {
        return "image";
    }

    static clone(node: ServerImageNode): ServerImageNode {
        return new ServerImageNode(
            node.__src,
            node.__altText,
            node.__width,
            node.__height,
            node.__key,
        );
    }

    constructor(
        src: string,
        altText: string,
        width?: number | "inherit",
        height?: number | "inherit",
        key?: NodeKey,
    ) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__width = width ?? "inherit";
        this.__height = height ?? "inherit";
    }

    createDOM(): HTMLElement {
        const img = document.createElement("img");
        img.src = this.__src;
        img.alt = this.__altText;
        if (this.__width !== "inherit") img.width = this.__width;
        if (this.__height !== "inherit") img.height = this.__height;
        return img;
    }

    updateDOM(): false {
        return false;
    }

    static importJSON(serializedNode: SerializedServerImageNode): ServerImageNode {
        return new ServerImageNode(
            serializedNode.src,
            serializedNode.altText,
            serializedNode.width,
            serializedNode.height,
            serializedNode.key,
        );
    }

    exportJSON(): SerializedServerImageNode {
        return {
            ...super.exportJSON(),
            type: "image",
            version: 1,
            altText: this.__altText,
            src: this.__src,
            width: this.__width === "inherit" ? undefined : this.__width,
            height: this.__height === "inherit" ? undefined : this.__height,
            key: this.__key,
        };
    }
}

const headlessEditorConfig = {
    namespace: "ServerEditor",
    onError: (error: Error) => console.error(error),
    nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableRowNode,
        TableCellNode,
        ServerImageNode,
    ],
};

function isSerializedEditorState(
    value: unknown,
): value is SerializedEditorState<SerializedLexicalNode> {
    if (!value || typeof value !== "object") {
        return false;
    }

    const maybeState = value as { root?: unknown };
    return typeof maybeState.root === "object" && maybeState.root !== null;
}

export function parseLexicalBodyToHTML(
    body: string | Record<string, unknown> | null,
): string {
    if (!body) return "";

    let parsedState: SerializedEditorState<SerializedLexicalNode> | null = null;

    try {
        if (typeof body === "string") {
            const parsedBody = JSON.parse(body) as unknown;
            if (isSerializedEditorState(parsedBody)) {
                parsedState = parsedBody;
            }
        } else if (isSerializedEditorState(body)) {
            parsedState = body;
        }
    } catch (error) {
        console.error("Failed to parse Lexical JSON", error);
        return "";
    }

    if (!parsedState) {
        return "";
    }

    try {
        const editor = createHeadlessEditor(headlessEditorConfig);
        const editorState = editor.parseEditorState(parsedState);
        editor.setEditorState(editorState);
        const dom = new JSDOM("<!doctype html><html><body></body></html>");
        const previousWindow = (globalThis as { window?: Window }).window;
        const previousDocument = (globalThis as { document?: Document }).document;

        (globalThis as { window?: Window }).window = dom.window as unknown as Window;
        (globalThis as { document?: Document }).document = dom.window.document;

        const html = editorState.read(() => $generateHtmlFromNodes(editor));

        if (previousWindow) {
            (globalThis as { window?: Window }).window = previousWindow;
        } else {
            delete (globalThis as { window?: Window }).window;
        }

        if (previousDocument) {
            (globalThis as { document?: Document }).document = previousDocument;
        } else {
            delete (globalThis as { document?: Document }).document;
        }

        return html;
    } catch (error) {
        console.error("Failed to convert Lexical JSON to HTML", error);
        return "";
    }
}
