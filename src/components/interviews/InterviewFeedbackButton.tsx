import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, CheckCircle, Edit } from "lucide-react";
import { InterviewFeedbackForm } from "./InterviewFeedbackForm";
import { useInterviewFeedback } from "@/hooks/useInterviewFeedback";
import { useAuth } from "@/hooks/useAuth";

interface InterviewFeedbackButtonProps {
  interview: {
    id: number;
    job: {
      title: string;
      company: string;
    };
    status: string;
  };
}

export const InterviewFeedbackButton = ({ interview }: InterviewFeedbackButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { data: existingFeedback, refetch } = useInterviewFeedback(
    interview.id, 
    user?.id
  );

  const handleFeedbackSubmitted = () => {
    setIsOpen(false);
    refetch();
  };

  // Only show feedback button for completed interviews
  if (interview.status !== "completed") {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={existingFeedback ? "outline" : "default"}
          size="sm"
          className="gap-2"
        >
          {existingFeedback ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <Edit className="h-4 w-4" />
              Edit Feedback
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4" />
              Give Feedback
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Interview Feedback</DialogTitle>
        </DialogHeader>
        
        <InterviewFeedbackForm
          interviewId={interview.id}
          candidateId={user?.id || ""}
          jobTitle={interview.job.title}
          company={interview.job.company}
          onFeedbackSubmitted={handleFeedbackSubmitted}
          existingFeedback={existingFeedback}
        />
      </DialogContent>
    </Dialog>
  );
};