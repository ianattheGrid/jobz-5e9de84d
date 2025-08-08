import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle } from "lucide-react";
import { EmployerInterviewFeedbackDialog } from './EmployerInterviewFeedbackDialog';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface InterviewFeedbackButtonProps {
  interview: {
    id: number;
    candidate_id: string;
    status: string;
    job: {
      id: number;
      title: string;
      company: string;
    };
  };
}

export const InterviewFeedbackButton = ({ interview }: InterviewFeedbackButtonProps) => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Only show for completed interviews
  if (interview.status !== 'completed') {
    return null;
  }

  const { data: existingFeedback } = useQuery({
    queryKey: ['employer_interview_feedback', interview.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employer_interview_feedback')
        .select('*')
        .eq('interview_id', interview.id)
        .eq('employer_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const hasSubmittedFeedback = !!existingFeedback;

  return (
    <>
      <Button
        variant={hasSubmittedFeedback ? "secondary" : "default"}
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="flex items-center gap-2"
      >
        {hasSubmittedFeedback ? (
          <>
            <CheckCircle className="h-4 w-4" />
            View Feedback
          </>
        ) : (
          <>
            <MessageSquare className="h-4 w-4" />
            Provide Feedback
          </>
        )}
      </Button>

      {user && (
        <EmployerInterviewFeedbackDialog
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          interview={interview}
          employerId={user.id}
        />
      )}
    </>
  );
};