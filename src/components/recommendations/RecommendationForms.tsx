
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { recommendationFormSchema } from "./recommendationFormSchema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

interface RecommendationFormValues {
  candidate_email: string;
  candidate_phone?: string;
  job_id?: number;
  notes?: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  candidate_commission: number | null;
}

export function RecommendationForms() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

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

      // Add candidate to general talent pool (2.5% standard commission)
      const { error } = await supabase.from("candidate_recommendations").insert({
        vr_id: session.session.user.id,
        candidate_email: data.candidate_email,
        candidate_phone: data.candidate_phone,
        notes: data.notes,
        recommendation_type: "general",
        commission_percentage: 2.5, // Standard 2.5% for general recommendations
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "General recommendation submitted successfully",
      });
      generalForm.reset();
      
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
      jobSpecificForm.reset();
      
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
              Use this form to recommend a candidate for our talent pool. You will receive a commission 
              of 2.5% of the candidate's first year salary if they are hired by any employer.
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
              Recommend a candidate for a specific job vacancy. Commission rates are set by the job 
              posting and will be displayed when you select a job.
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin h-6 w-6 border-2 border-[#ea384c] border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <Form {...jobSpecificForm}>
              <form onSubmit={jobSpecificForm.handleSubmit(onSubmitJobSpecific)} className="space-y-4">
                <div>
                  <Select 
                    onValueChange={(value) => jobSpecificForm.setValue("job_id", parseInt(value))}
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
                  disabled={isSubmitting || jobs.length === 0} 
                  className="w-full bg-[#ea384c] hover:bg-[#d32d3f] text-white"
                >
                  Submit Job-Specific Recommendation
                </Button>
              </form>
            </Form>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
