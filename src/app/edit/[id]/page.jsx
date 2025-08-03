"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Separator } from "../../../components/ui/Separator";
import { RichTextEditor } from "../../../components/rich-text-editor";
import { useAuth } from "../../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowLeft,
  faPaperPlane,
  faSpinner,
  faSignInAlt,
  faExclamationTriangle,
  faHeading,
  faInfoCircle,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { editQuestion, useEditQuestion, useQuestion } from "../../../hooks/useQuestionHook";

export default function CreatePostPage() {
  const { id } = useParams();
  const router = useRouter();
   const {  isSignedIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoaded,setDataLoaded] = useState(false);
  const {question , loading , error}  = useQuestion(id);

   useEffect(() => {
  if (question) {
    setPostData({
      title: question.title || "",
      description: question.description || "",
    });
    setDataLoaded(true); // allow editor to render now
  }
}, [question]);



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

function isValidHttpUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}



const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true); // shows loading UI

  try {
    await editQuestion(id, postData); // just call the function
    toast.success("Question updated!");
    router.push(`/question/${id}`);
  } catch (err) {
    toast.error(err.message);
  } finally {
    setIsSubmitting(false); // remove loading
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


  if (loading) {
    return (
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
  }

  if (error || !question) {
    return (
      <div className="p-4 text-center text-red-600">
        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
        Failed to load question. {error}
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
               <div className="flex items-center gap-2 mb-4">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="text-primary h-5 w-5"
                  />
                  <h1 className="text-xl font-semibold">Edit Question</h1>
                </div>

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
                      placeholder="Update the question"
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
                   {dataLoaded ? (
 <RichTextEditor
  key={question._id}
  content={
    isValidHttpUrl(postData.description)
      ? `<img src="${postData.description}" alt="Uploaded content" />`
      : postData.description
  }
  onChange={handleEditorChange}
  onImageUpload={handleImageUpload}
placeholder="Explain it breifly or you can upload image"
/>

) : (
  <p>Loading editor...</p>
)}

                   
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
                              Updating Post...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon
                                icon={faPaperPlane}
                                className="mr-2 h-4 w-4"
                              />
                              Update Post
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
