import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ThumbsUp } from "lucide-react";

const feedbackSchema = z.object({
  overall_sentiment: z.enum(["felt_positive", "still_interested", "no_longer_interested", "neutral"], {
    required_error: "Please select your overall feeling about the interview",
  }),
  additional_clarifications: z.string().optional(),
  general_feedback: z.string().optional(),
  wish_explained_better: z.string().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface InterviewFeedbackFormProps {
  interviewId: number;
  candidateId: string;
  jobTitle: string;
  company: string;
  onFeedbackSubmitted?: () => void;
  existingFeedback?: any;
}

const sentimentOptions = [
  { value: "felt_positive", label: "Felt very positive - great experience!" },
  { value: "still_interested", label: "Still interested and hopeful" },
  { value: "neutral", label: "Neutral - waiting to see next steps" },
  { value: "no_longer_interested", label: "No longer interested in this role" },
];

export const InterviewFeedbackForm = ({
  interviewId,
  candidateId,
  jobTitle,
  company,
  onFeedbackSubmitted,
  existingFeedback,
}: InterviewFeedbackFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      overall_sentiment: existingFeedback?.overall_sentiment || undefined,
      additional_clarifications: existingFeedback?.additional_clarifications || "",
      general_feedback: existingFeedback?.general_feedback || "",
      wish_explained_better: existingFeedback?.wish_explained_better || "",
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    try {
      const feedbackData = {
        interview_id: interviewId,
        candidate_id: candidateId,
        overall_sentiment: data.overall_sentiment,
        additional_clarifications: data.additional_clarifications || null,
        general_feedback: data.general_feedback || null,
        wish_explained_better: data.wish_explained_better || null,
      };

      let result;
      if (existingFeedback) {
        result = await supabase
          .from("interview_feedback")
          .update({
            overall_sentiment: data.overall_sentiment,
            additional_clarifications: data.additional_clarifications || null,
            general_feedback: data.general_feedback || null,
            wish_explained_better: data.wish_explained_better || null,
          })
          .eq("id", existingFeedback.id);
      } else {
        result = await supabase
          .from("interview_feedback")
          .insert(feedbackData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: existingFeedback ? "Feedback Updated!" : "Feedback Submitted!",
        description: "Thank you for sharing your interview experience. The employer will be able to see your feedback.",
      });

      onFeedbackSubmitted?.();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <ThumbsUp className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Interview Feedback</CardTitle>
        <CardDescription>
          Share your thoughts about your interview for <strong>{jobTitle}</strong> at <strong>{company}</strong>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="overall_sentiment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    How do you feel about the interview overall?
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your overall feeling..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sentimentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wish_explained_better"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Is there anything you wish you had explained better in the interview?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="This is your chance to clarify or expand on any points from the interview..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additional_clarifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Any additional information you'd like to share?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share any other thoughts, questions, or information..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="general_feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    How was your overall interview experience?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts about the interview process, the interviewer, the environment, etc..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting 
                  ? (existingFeedback ? "Updating..." : "Submitting...") 
                  : (existingFeedback ? "Update Feedback" : "Submit Feedback")
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};