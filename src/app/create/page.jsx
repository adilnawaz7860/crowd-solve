"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/Separator";
import { RichTextEditor } from "../../components/rich-text-editor";
import { useAuth } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowLeft,
  faPaperPlane,
  faSpinner,
  faSignInAlt,
  faExclamationTriangle,
  faHeading,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

export default function CreatePostPage() {
  const router = useRouter();
   const {  isSignedIn, userId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [postData, setPostData] = useState({
    title: "",
    description: "",
   
  
   
  });



   const handleEditorChange = (value) => {
    setPostData((prev) => ({
      ...prev,
      description: value,
    }));
  };

const handleImageUpload = (url) => {
  setPostData((prev) => ({
    ...prev,
    description: url, 
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();

   

    if (!postData.title.trim() || !postData.description) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...postData, userId}),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const ques = await response.json();
      toast.success("Question Created")
      router.push(`/question/${ques._id}`);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="mx-auto max-w-2xl">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-6 text-center">
                  <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-muted-foreground h-8 w-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">
                      Authentication Required
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      You need to be signed in to ask a question with the community.
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push("/auth/login")}
                    size="lg"
                    className="w-full"
                  >
                    <FontAwesomeIcon
                      icon={faSignInAlt}
                      className="mr-2 h-4 w-4"
                    />
                    Sign In to Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
  
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="mx-auto max-w-2xl space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
         
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="text-muted-foreground hover:text-foreground -ml-2"
                  >
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className="mr-2 h-4 w-4"
                    />
                    Back
                  </Button>
              
             
           
            </div>

            <Card className="border shadow-sm">
              <CardContent className="space-y-6 pt-6">
                <form className="space-y-6">
                  {/* Title Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={faHeading}
                            className="text-muted-foreground h-4 w-4 cursor-help"
                          />
                       
                      
                      <Label
                        htmlFor="title"
                        className="text-base font-semibold"
                      >
                        Title
                      </Label>
                      <span className="text-destructive text-xs font-medium">
                        *
                      </span>
                    
                        
                       
                    
                    </div>
                    <Input
                      id="title"
                      placeholder="Write The Question"
                      value={postData.title}
                      onChange={(e) =>
                        setPostData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                      className="bg-background h-12 text-base"
                    />
                  
                  </div>

                  <Separator />

              

                  {/* Content Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                    
                      <Label className="text-base font-semibold">Description</Label>
                      <span className="text-destructive text-xs font-medium">
                        *
                      </span>
                    
                    </div>
                    <RichTextEditor
                      content={postData.description}
                      onChange={handleEditorChange}
                      onImageUpload={handleImageUpload}
                      placeholder="Explain it breifly or you can upload image"
                    />
                   
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
               
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.back()}
                          disabled={isSubmitting}
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                     
                    
                        <Button
                          type="button"
                          onClick={handleSubmit}
                          disabled={
                            !postData.title.trim() ||
                            !postData.description ||
                            isSubmitting
                          }
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          {isSubmitting ? (
                            <>
                              <FontAwesomeIcon
                                icon={faSpinner}
                                className="mr-2 h-4 w-4 animate-spin"
                              />
                              Creating Post...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon
                                icon={faPaperPlane}
                                className="mr-2 h-4 w-4"
                              />
                              Create Post
                            </>
                          )}
                        </Button>
                   
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
