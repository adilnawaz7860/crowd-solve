"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { PostsListSkeleton } from "../../components/posts/post-skeleton";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {useQuestions} from '../../hooks/useQuestionHook'
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faComments } from "@fortawesome/free-solid-svg-icons";




export function PostsList({ initialPage = 1, }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const questionsPerPage = 10;

 const { questions, pagination, loading, error, refetch } = useQuestions(currentPage, questionsPerPage);



  if (loading) {
    return <PostsListSkeleton count={questionsPerPage} />;
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <AlertTriangle className="text-destructive mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">Failed to load posts</h3>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
        <Button onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const ques = questions ?? [];

  

  if (ques.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="mb-2 dark:text-white text-lg font-semibold">No questions yet</h3>
        <p className="text-muted-foreground">
          Be the first to ask a question
        </p>
      </div>
    );
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Smooth scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

const renderPaginationButtons = () => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;
  const buttons = [];

  // Previous button
  buttons.push(
    <Button
      key="prev"
      variant="outline"
      size="sm"
      className="h-8 w-8 rounded-full p-0"
      onClick={() => handlePageChange(page - 1)}
      disabled={page <= 1}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  );

  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);

  if (startPage > 1) {
    buttons.push(
      <Button
        key={1}
        variant={page === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => handlePageChange(1)}
      >
        1
      </Button>
    );
    if (startPage > 2) {
      buttons.push(
        <span key="ellipsis1" className="text-muted-foreground px-2">...</span>
      );
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    buttons.push(
      <Button
        key={i}
        variant={page === i ? "default" : "outline"}
        size="sm"
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Button>
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="ellipsis2" className="text-muted-foreground px-2">...</span>
      );
    }
    buttons.push(
      <Button
        key={totalPages}
        variant={page === totalPages ? "default" : "outline"}
        size="sm"
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </Button>
    );
  }

  // Next button
  buttons.push(
    <Button
      key="next"
      variant="outline"
      size="sm"
      className="h-8 w-8 rounded-full p-0"
      onClick={() => handlePageChange(page + 1)}
      disabled={page >= totalPages}
    >
      <ChevronRight className="size-4" />
    </Button>
  );

  return buttons;
};


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
                        <FontAwesomeIcon
                          icon={faComments}
                          className="text-primary h-5 w-5"
                        />
                        <h1 className="text-xl font-semibold">All Question</h1>
                      </div>
      {/* Posts List */}
      <div className="space-y-6">
     
        {ques.map((post) => (
          <Card key={post._id} className="transition-shadow hover:shadow-md group">
            <Link 
              href={`/question/${post._id}`}
              className="block cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="line-clamp-2 group-hover:text-primary capitalize transition-colors">
                        {post.title}
                      </CardTitle>
                    </div>

                   
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 mt-2">
                {/* Author and Meta */}
                <div className="text-muted-foreground flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={post?.author?.image ?? undefined} />
                      <AvatarFallback className="text-xs capitalize">
                        {post?.userId?.name?.charAt(0)?.toUpperCase() ?? ""}
                      </AvatarFallback>
                    </Avatar>
                    <span className="capitalize">{post?.userId?.name ?? ""}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                   {/* <div onClick={(e) => e.preventDefault()} className="relative z-10">
                    <ReactionButtons postId={post._id} />
                  </div> */}

                
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 py-4">
          <div className="flex items-center gap-1">
            {renderPaginationButtons()}
          </div>
          <div className="text-muted-foreground text-center text-sm">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} ques
          </div>
        </div>
      )}
    </div>
  );
}
