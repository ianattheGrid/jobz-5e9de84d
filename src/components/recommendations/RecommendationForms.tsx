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
      <Tabs defaultValue="general" className="w-full space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Submit a Recommendation</h2>
          <p className="text-gray-600">Choose the type of recommendation you want to submit:</p>
        </div>
        
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="general" 
            className="data-[state=active]:bg-[#ea384c] data-[state=active]:text-white"
          >
            General Recommendation
          </TabsTrigger>
          <TabsTrigger 
            value="job-specific"
            className="data-[state=active]:bg-[#ea384c] data-[state=active]:text-white"
          >
            Job-Specific Recommendation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">About General Recommendations</h3>
            <p className="text-sm text-gray-600">
              Use this form to recommend a candidate for our talent pool. This recommendation
              will be considered for all suitable job opportunities.
            </p>
          </div>
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
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-[#ea384c] hover:bg-[#d32d3f] text-white"
              >
                Submit General Recommendation
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="job-specific">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">About Job-Specific Recommendations</h3>
            <p className="text-sm text-gray-600">
              Use this form when you have a specific job in mind for your candidate. 
              You'll need the job ID which can be found in the job listing.
            </p>
          </div>
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
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-[#ea384c] hover:bg-[#d32d3f] text-white"
              >
                Submit Job-Specific Recommendation
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}