"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/Separator";
import { Upload, Undo, Redo, Image as ImageIcon } from "lucide-react";

import { useUploadThing } from "../lib/uploadThing";
import { useState, useEffect, useCallback } from "react";
import { cn } from "../lib/utils";
import { toast } from "sonner";

export function RichTextEditor({
  content,
  onChange,
  onImageUpload,
  placeholder = "Start writing your post...",
  className,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasText, setHasText] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        const url = res[0].url;
        editor?.chain().focus().setImage({ src: url }).run();
        onImageUpload?.(url);
        setHasImage(true); // prevent typing
      }
      setIsUploading(false);
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      setIsUploading(false);
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageUpload = useCallback(
    (files) => {
      if (hasText) {
        toast.warning("You can either upload an image OR type text, not both.");
        return;
      }
      if (files && files[0]) {
        setIsUploading(true);
        startUpload([files[0]]);
      }
    },
    [startUpload, hasText]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      const hasTextNow = text.length > 0;
      setHasText(hasTextNow);
      onChange(text);
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-6",
      },
      handleKeyDown: () => {
        if (hasImage) return true; // block typing if image uploaded
      },
    },
  });

  const triggerFileInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const target = e.target;
      handleImageUpload(target.files);
    };
    input.click();
  };

  if (!isMounted || !editor) {
    return (
      <div className={cn("w-full", className)}>
        <Card className="min-h-[400px] p-6">Loading editor...</Card>
      </div>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <div className="border-b p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={triggerFileInput}
            disabled={isUploading || hasText}
          >
            {isUploading ? (
              <Upload className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="min-h-[400px] px-6">
        <EditorContent editor={editor} />
      </div>
    </Card>
  );
}
