"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Separator } from "../../../components/ui/Separator";
import { PostClientWrapper } from "../../../components/posts/post-client-wrapper";
import { EditQuestionButton } from "../../../components/posts/edit-question-button";
import { DeleteQuestionButton } from "../../../components/posts/delete-question-button";
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faUser,
  faTag,
  faSpinner,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import { useQuestion } from "../../../hooks/useQuestionHook"; // ✅ your hook here
import { notFound } from "next/navigation";
import { Button } from "../../../components/ui/button";

export default function QuestionPage() {
  const { questionId } = useParams();
  const router = useRouter();
  const { question, loading, error } = useQuestion(questionId);

  if (loading) return (
      <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 py-6">
              <div className="mx-auto max-w-2xl">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6 text-center">
                      <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className="text-muted-foreground h-8 w-8 animate-spin"
                        />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">
                          Loading Question...
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Please wait while we fetch the question data.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
  );
  if (error || !question) {
    notFound(); // shows 404 page
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-6">
        
           <div className="space-y-4">
         
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/auth/login")}
                    className="text-muted-foreground hover:text-foreground -ml-2"
                  >
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className="mr-2 h-4 w-4"
                    />
                    Back
                  </Button>
              
             
           
            </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-6 pb-4">
              <div className="space-y-3">
                <h1 className="text-foreground  capitalize text-2xl leading-tight font-bold tracking-tight">
                  {question.title}
                </h1>

              
              </div>

              <Separator className="bg-border/50" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="ring-border/20 h-10 w-10 ring-2">
                    <AvatarImage
                      src={question.author?.image ?? undefined}
                      alt={question.userId?.name ?? "User avatar"}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-foreground capitalize font-medium">
                      {question.userId?.name ?? "Anonymous User"}
                    </p>
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(question.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <EditQuestionButton
                    questionId={question._id}
                    authorId={question.userId?._id}
                  />
                 
                  <DeleteQuestionButton
                    questionId={question._id}
                    postTitle={question.title}
                    authorId={question.userId?._id}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-0">
              <PostClientWrapper questionId={question._id} content={question.description} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
