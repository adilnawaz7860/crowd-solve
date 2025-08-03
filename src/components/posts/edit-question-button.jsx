"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth.js";


export function EditQuestionButton({ questionId, authorId}) {
  const { user, userId ,isSignedIn } = useAuth();

  // Check if user can edit: owner, collaborator, or admin
  const isOwner = userId === authorId;


  if (!isSignedIn || !isOwner ) {
    return null;
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={`/edit/${questionId}`}>
        <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
      </Link>
    </Button>
  );
} 