"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

export function DeleteQuestionButton({ questionId, postTitle ,authorId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { userId ,isSignedIn } = useAuth();
  
    // Check if user can edit: owner, collaborator, or admin
    const isOwner = userId === authorId;

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }  
       
      toast.success("Question Deleted")

      router.push("/");
    } catch (error) {
      console.error("Error deleting question:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

    if (!isSignedIn || !isOwner ) {
    return null;
  }

  return (
    <>
      <Button
      className='cursor-pointer'
        variant="destructive"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
      >
        <FontAwesomeIcon icon={faTrash} className="h-4 w-4 cursor-pointer" />
        
      </Button>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-destructive h-5 w-5"
              />
              Delete Question
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{postTitle}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faTrash} className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
