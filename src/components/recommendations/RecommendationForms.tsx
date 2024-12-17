import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { recommendationFormSchema } from "./recommendationFormSchema";

interface RecommendationFormValues {
  candidate_email: string;
  candidate_phone?: string;
  job_id?: number;
  notes?: string;
}

export function RecommendationForms() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generalForm = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: {
      candidate_email: "",
      candidate_phone: "",
      notes: "",
    },
  });

  const jobSpecificForm = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: {
      candidate_email: "",
      candidate_phone: "",
      job_id: undefined,
      notes: "",
    },
  });

  const onSubmitGeneral = async (data: RecommendationFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit recommendations",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("candidate_recommendations").insert({
        vr_id: session.session.user.id,
        candidate_email: data.candidate_email,
        candidate_phone: data.candidate_phone,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "General recommendation submitted successfully",
      });
      generalForm.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit recommendation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitJobSpecific = async (data: RecommendationFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit recommendations",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("candidate_recommendations").insert({
        vr_id: session.session.user.id,
        job_id: data.job_id,
        candidate_email: data.candidate_email,
        candidate_phone: data.candidate_phone,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job-specific recommendation submitted successfully",
      });
      jobSpecificForm.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit recommendation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Recommendation</TabsTrigger>
          <TabsTrigger value="job-specific">Job-Specific Recommendation</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Form {...generalForm}>
            <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-4">
              <div>
                <Input
                  {...generalForm.register("candidate_email")}
                  placeholder="Candidate Email"
                  type="email"
                />
              </div>
              <div>
                <Input
                  {...generalForm.register("candidate_phone")}
                  placeholder="Candidate Phone (optional)"
                  type="tel"
                />
              </div>
              <div>
                <Textarea
                  {...generalForm.register("notes")}
                  placeholder="Additional Notes (optional)"
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                Submit General Recommendation
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="job-specific">
          <Form {...jobSpecificForm}>
            <form onSubmit={jobSpecificForm.handleSubmit(onSubmitJobSpecific)} className="space-y-4">
              <div>
                <Input
                  {...jobSpecificForm.register("job_id", { valueAsNumber: true })}
                  placeholder="Job ID"
                  type="number"
                />
              </div>
              <div>
                <Input
                  {...jobSpecificForm.register("candidate_email")}
                  placeholder="Candidate Email"
                  type="email"
                />
              </div>
              <div>
                <Input
                  {...jobSpecificForm.register("candidate_phone")}
                  placeholder="Candidate Phone (optional)"
                  type="tel"
                />
              </div>
              <div>
                <Textarea
                  {...jobSpecificForm.register("notes")}
                  placeholder="Additional Notes (optional)"
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                Submit Job-Specific Recommendation
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}