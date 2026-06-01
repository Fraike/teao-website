"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MarkdownIt from "markdown-it";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import {
  Bold, Italic, UnderlineIcon, Heading2, Heading3,
  List, ListOrdered, Quote, Code2, Link2, ImageIcon,
  AlignLeft, AlignCenter, AlignRight, Minus,
  Table as TableIcon, Eye, Pencil,
} from "lucide-react";
import { useState, useCallback } from "react";
import MediaPicker from "./MediaPicker";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const markdownParser = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

function looksLikeMarkdown(text: string) {
  const trimmed = text.trim();
  if (!trimmed || !trimmed.includes("\n")) return false;

  const patterns = [
    /^#{1,6}\s+\S/m,
    /^>\s+\S/m,
    /^[-*+]\s+\S/m,
    /^\d+\.\s+\S/m,
    /^```[\s\S]*```/m,
    /^---+$/m,
    /\*\*[^*\n]+\*\*/,
    /_[^_\n]+_/,
    /!\[[^\]]*]\([^)]+\)/,
    /\[[^\]]+]\([^)]+\)/,
    /^\|.+\|\s*\n\|[\s:-]+\|/m,
  ];

  return patterns.some((pattern) => pattern.test(trimmed));
}

function renderMarkdown(text: string) {
  return markdownParser.render(text);
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`h-8 w-8 flex items-center justify-center rounded text-xs transition-colors ${
        active
          ? "bg-[#ED7606] text-white"
          : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange }: Props) {
  const [showPreview, setShowPreview] = useState(true);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write your article content..." }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[400px] px-4 py-3 text-[#374151] text-sm leading-relaxed",
      },
      handlePaste: (_view, event) => {
        const clipboard = event.clipboardData;
        if (!clipboard) return false;

        const html = clipboard.getData("text/html");
        const plainText = clipboard.getData("text/plain");
        if (html || !looksLikeMarkdown(plainText)) return false;

        event.preventDefault();
        const rendered = renderMarkdown(plainText);
        editor?.chain().focus().insertContent(rendered).run();
        return true;
      },
    },
  });

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    setImagePickerOpen(true);
  }, [editor]);

  if (!editor) return null;

  const ToolbarDivider = () => (
    <div className="w-px h-5 bg-[#E5E7EB] mx-0.5" />
  );

  const htmlContent = editor.getHTML();

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
      {/* Hidden MediaPicker for image insertion */}
      <MediaPicker
        value=""
        onChange={(url) => {
          if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
            setImagePickerOpen(false);
          }
        }}
        open={imagePickerOpen}
        onOpenChange={setImagePickerOpen}
        compact
        placeholder="Select image"
      />
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[#E5E7EB] bg-[#F8F9FA] flex-wrap">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <UnderlineIcon size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <Heading3 size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
        >
          <ListOrdered size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <Code2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={addLink} title="Insert Link">
          <Link2 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Insert Image">
          <ImageIcon size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert Table"
        >
          <TableIcon size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align Left"
        >
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
        >
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align Right"
        >
          <AlignRight size={15} />
        </ToolbarButton>

        {/* Preview toggle (mobile-friendly) */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`h-8 px-2.5 flex items-center gap-1.5 rounded text-[11px] font-medium transition-colors ${
              showPreview
                ? "bg-[#ED7606] text-white"
                : "text-[#6B7280] hover:bg-[#F3F4F6]"
            }`}
            title="Toggle Preview"
          >
            {showPreview ? <Eye size={13} /> : <Pencil size={13} />}
            <span className="hidden sm:inline">{showPreview ? "Preview" : "Edit"}</span>
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className={`grid ${showPreview ? "grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]" : "grid-cols-1"} divide-y xl:divide-y-0 xl:divide-x divide-[#E5E7EB]`}>
        {/* Editor */}
        <div className="bg-white">
          <div className="border-b border-[#F3F4F6] px-4 py-2 text-[11px] font-medium text-[#9CA3AF]">
            Paste Markdown to automatically convert headings, lists, links, images, code blocks and tables.
          </div>
          <EditorContent editor={editor} />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="bg-[#FCFCFC]">
            <div className="px-3 py-2 border-b border-[#E5E7EB] bg-[#F8F9FA]">
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9CA3AF]">
                Live Preview
              </span>
            </div>
            <div
              className="news-article-body prose prose-sm max-w-none p-4 text-[#333333] leading-relaxed
                prose-headings:text-[#111827] prose-headings:font-bold
                prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
                prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                prose-p:my-2
                prose-a:text-[#ED7606] prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-blockquote:border-l-4 prose-blockquote:border-[#ED7606] prose-blockquote:bg-[#FFF7ED] prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-[#374151]
                prose-code:bg-[#F3F4F6] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[#ED7606] prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[#111827] prose-pre:text-[#E5E7EB] prose-pre:rounded-xl
                prose-table:border prose-table:rounded-lg prose-th:bg-[#F8F9FA] prose-th:px-3 prose-th:py-2 prose-th:text-xs prose-th:font-medium prose-td:px-3 prose-td:py-2 prose-td:text-sm
                prose-li:text-[#374151]
                prose-hr:border-[#E5E7EB]
              "
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
