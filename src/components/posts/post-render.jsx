"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { QuestionBlock } from "../../components/question-block";



export function PostRenderer({ content, className }) {
  const editor = useEditor({
    extensions: [StarterKit, Image, QuestionBlock],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: `prose dark:prose-invert max-w-none ${className ?? ""}`,
      },
    },
    immediatelyRender : false,
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
