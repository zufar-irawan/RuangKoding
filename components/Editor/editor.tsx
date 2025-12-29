"use client";

import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ToolbarPlugin } from "./Plugin/ToolbarPlugin";

import { LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";

import { ImageNode } from "./node/ImageNode";
import { ImagePlugin } from "./Plugin/ImagePlugin";
import { PastePlugin } from "./Plugin/PastePlugin";

import { TableNode, TableRowNode, TableCellNode } from "@lexical/table";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { CodeHighlightRegisterPlugin } from "./Plugin/CodeHighlightRegisterPlugin";
import { CodeBlockPlugin } from "./Plugin/CodeBlockPlugin";
import { AutoGrowPlugin } from "./Plugin/AutoGrowPlugin";
import { useCallback } from "react";
import { $getRoot, EditorState } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

type EditorProps = {
  initialState?: string;
  onChange?: (payload: string) => void;
  excerpt?: (payload: string) => void;
  autoFocus?: boolean;
};

const theme = {
  text: {
    bold: "font-semibold text-foreground",
    italic: "italic",
    underline: "underline decoration-primary",
    strikethrough: "line-through",
    code: "rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-muted-foreground",
  },

  heading: {
    h1: "mb-4 text-4xl font-semibold text-foreground",
    h2: "mb-4 text-3xl font-semibold text-foreground",
    h3: "mb-4 text-2xl font-semibold text-foreground",
  },

  list: {
    ul: "ml-6 list-disc",
    ol: "ml-6 list-decimal",
  },

  code: "editor-code mt-6",

  codeHighlight: {
    comment: "token comment",
    prolog: "token comment",
    doctype: "token comment",
    cdata: "token comment",
    punctuation: "token punctuation",
    namespace: "token namespace",
    property: "token property",
    tag: "token tag",
    boolean: "token boolean",
    number: "token number",
    constant: "token constant",
    symbol: "token symbol",
    delete: "token delete",
    selector: "token selector",
    "attr-name": "token attr-name",
    string: "token string",
    char: "token char",
    builtin: "token builtin",
    inserted: "token inserted",
    operator: "token operator",
    entity: "token entity",
    url: "token url",
    atrule: "token atrule",
    "attr-value": "token attr-value",
    keyword: "token keyword",
    function: "token function",
    regex: "token regex",
    important: "token important",
    variable: "token variable",
    bold: "token bold",
    italic: "token italic",
  },

  image: "editor-image",

  table: "editor-table",
  tableRow: "editor-table-row",
  tableCell: "editor-table-cell text-sm text-foreground",
  tableCellHeader: "editor-table-cell-header",

  link: "text-primary underline underline-offset-4 hover:text-primary/80",

  format: {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  },
};

function onError(error: Error) {
  console.error(error);
}

function Placeholder() {
  return (
    <div className="pointer-events-none absolute left-5 top-6 text-sm text-muted-foreground/80">
      Mulai menulis konten...
    </div>
  );
}

export function Editor({
  initialState,
  onChange,
  excerpt,
  autoFocus = true,
}: EditorProps) {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    editorState: initialState || undefined,
    nodes: [
      HeadingNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      ListNode,
      ListItemNode,
      LinkNode,
      ImageNode,
      TableNode,
      TableRowNode,
      TableCellNode,
    ],
  };

  const handleEditorChange = useCallback(
    (editorState: EditorState) => {
      if (!onChange) return;
      const json = JSON.stringify(editorState.toJSON());
      onChange(json);

      if (excerpt) {
        editorState.read(() => {
          const bodyText = $getRoot().getTextContent();
          const excerptText =
            bodyText.length > 210 ? `${bodyText.slice(0, 207)}...` : bodyText;
          excerpt(excerptText);
        });
      }
    },
    [onChange, excerpt],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="my-4 flex w-full flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground">
        <ToolbarPlugin />

        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[250px] md:min-h-[320px] w-full bg-transparent p-3 md:p-5 text-sm md:text-base leading-relaxed text-foreground outline-none" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <OnChangePlugin onChange={handleEditorChange} />
        <HistoryPlugin />
        {autoFocus && <AutoFocusPlugin />}
        <ListPlugin />
        <CodeHighlightRegisterPlugin />
        <CodeBlockPlugin />
        <AutoGrowPlugin />
        <ImagePlugin />
        <PastePlugin />
        <LinkPlugin />
        <TablePlugin
          hasCellMerge
          hasCellBackgroundColor
          hasTabHandler
          hasHorizontalScroll
        />
      </div>
    </LexicalComposer>
  );
}
