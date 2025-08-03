"use client";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils.js";
import { useAuth } from "../hooks/useAuth";

export function AnswerItem({ answer, onVote }) {
  const { userId } = useAuth();

  // Get the current user's vote
  const userVote = answer.votes?.find(
    (v) => v.userId?.toString() === userId?.toString()
  );

  // Count upvotes and downvotes
  const upvotes = answer.votes?.filter((v) => v.type === "UPVOTE").length || 0;
  const downvotes =
    answer.votes?.filter((v) => v.type === "DOWNVOTE").length || 0;
  const score = upvotes - downvotes;

  const handleVote = async (type) => {
    if (!userId) return;
    await onVote(answer._id, type, userId);
  };

  return (
    <div className="relative space-y-2">
      <div className="relative flex gap-3 rounded-md border p-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={answer.userId?.image ?? undefined} />
          <AvatarFallback><p className="capitalize">{answer.userId?.name?.[0] || "U"}</p></AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="text-sm capitalize font-semibold">
            {answer.userId?.name || "Anonymous"}
          </div>

          <div className="text-sm text-gray-800 whitespace-pre-wrap">
            {answer.content}
          </div>

          <div className="text-xs text-muted-foreground">
            {new Date(answer.createdAt).toLocaleString()}
          </div>

          <div className="flex items-center gap-2 text-xs mt-2">
            {userId ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote("UPVOTE")}
                  className={cn(
                    "h-6 w-6 p-0",
                    userVote?.type === "UPVOTE" &&
                      "text-green-600 hover:bg-green-100 dark:text-green-400"
                  )}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>

                <span
                  className={cn(
                    "text-xs font-medium min-w-[20px] text-center",
                    score > 0 && "text-green-600 dark:text-green-400",
                    score < 0 && "text-red-600 dark:text-red-400"
                  )}
                >
                  {score}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote("DOWNVOTE")}
                  className={cn(
                    "h-6 w-6 p-0",
                    userVote?.type === "DOWNVOTE" &&
                      "text-red-600 hover:bg-red-100 dark:text-red-400"
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <span className="text-muted-foreground">Sign in to vote</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
