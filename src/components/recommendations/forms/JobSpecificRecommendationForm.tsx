
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { recommendationFormSchema } from "../recommendationFormSchema";

interface Job {
  id: number;
  title: string;
  company: string;
  candidate_commission: number | null;
}

interface JobSpecificRecommendationFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export function JobSpecificRecommendationForm({
  isSubmitting,
  setIsSubmitting
}: JobSpecificRecommendationFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<{
    candidate_email: string;
    candidate_phone?: string;
    job_id?: number;
    notes?: string;
  }>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: {
      candidate_email: "",
      candidate_phone: "",
      job_id: undefined,
      notes: "",
    },
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Fetch jobs with candidate_commission (jobs that accept VR referrals)
        const { data, error } = await supabase
          .from("jobs")
          .select("id, title, company, candidate_commission")
          .not("candidate_commission", "is", null)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (error: any) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load available jobs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [toast]);

  const onSubmit = async (data: {
    candidate_email: string;
    candidate_phone?: string;
    job_id?: number;
    notes?: string;
  }) => {
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

      // Find the selected job to get its commission rate
      const selectedJob = jobs.find(job => job.id === data.job_id);
      if (!selectedJob) {
        throw new Error("Selected job not found");
      }

      // Job-specific recommendation with job's commission rate
      const { error } = await supabase.from("candidate_recommendations").insert({
        vr_id: session.session.user.id,
        job_id: data.job_id,
        candidate_email: data.candidate_email,
        candidate_phone: data.candidate_phone,
        notes: data.notes,
        recommendation_type: "job_specific",
        commission_percentage: selectedJob.candidate_commission,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job-specific recommendation submitted successfully",
      });
      form.reset();
      
      // Navigate back to dashboard after successful submission
      navigate("/vr/dashboard");
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
    <>
      {loading ? (
        <div className="flex justify-center p-6">
          <div className="animate-spin h-6 w-6 border-2 border-[#ea384c] border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Select 
                onValueChange={(value) => form.setValue("job_id", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a job vacancy" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id.toString()}>
                        {job.title} at {job.company} - {job.candidate_commission}% commission
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No jobs available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                {...form.register("candidate_email")}
                placeholder="Candidate Email"
                type="email"
              />
            </div>
            <div>
              <Input
                {...form.register("candidate_phone")}
                placeholder="Candidate Phone (optional)"
                type="tel"
              />
            </div>
            <div>
              <Textarea
                {...form.register("notes")}
                placeholder="Additional Notes (optional)"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || jobs.length === 0} 
              className="w-full bg-[#ea384c] hover:bg-[#d32d3f] text-white"
            >
              Submit Job-Specific Recommendation
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
