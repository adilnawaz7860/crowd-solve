"use client";

import { PostRenderer } from "../../components/posts/post-render";
import {AnswersSection } from "../comments-section";
import { Separator } from "../../components/ui/Separator";

function isValidHttpUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}



export function PostClientWrapper({ questionId, content }) {
  return (
    <>
      {/* Post Content */}
      <PostRenderer   content={
    isValidHttpUrl(content)
      ? `<img src="${content}" alt="Uploaded content" />`
      : content
  } />

      <Separator className="bg-border/50" />
      <AnswersSection questionId={questionId} />
    </>
  );
}
