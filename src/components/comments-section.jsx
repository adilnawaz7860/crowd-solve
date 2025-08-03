"use client";

import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useAnswers } from "../hooks/useAnswerHook.js";
import { useAuth } from "../hooks/useAuth";
import { AnswerForm } from "./answer-form";
import { AnswerItem } from "./answer-item";

function AnswerSkeleton() {
  return (
    <div className="flex gap-3">
      <div className="mt-1 flex-shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <Skeleton className="h-full w-full rounded-full" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

function AnswersSkeleton({ count = 3 }) {
  return (
    <div className="mb-4 space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <AnswerSkeleton key={index} />
      ))}
    </div>
  );
}

export function AnswersSection({ questionId }) {
  const { userId } = useAuth();

  
  const { answers, loading, createAnswer , voteAnswer } = useAnswers(questionId , userId);


  const handleCreateAnswer = async (content) => {
    await createAnswer(content , userId);
  };

  return (
    <Card className="pb-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Answers ({answers.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {userId ? (
          <AnswerForm onSubmit={handleCreateAnswer} placeholder="Write your answer..." />
        ) : (
          <Card className="p-4">
            <p className="text-muted-foreground text-center">
              Sign in to write an answer
            </p>
          </Card>
        )}

        {loading ? (
          <AnswersSkeleton count={2} />
        ) : answers.length === 0 ? (
          <div className="py-8 text-center">
            <MessageSquare className="text-muted-foreground/50 mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-semibold">No answers yet</h3>
            <p className="text-muted-foreground">Be the first to answer this question.</p>
          </div>
        ) : (
          <div className="mb-4 space-y-3">
            {answers.map((answer) => (
              <AnswerItem
                key={answer._id}
                answer={answer}
                onVote={voteAnswer}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
