
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { recommendationFormSchema } from "../recommendationFormSchema";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchRecommendationStatus } from "@/utils/auth/fetchRecommendationStatus";

interface GeneralRecommendationFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export function GeneralRecommendationForm({ 
  isSubmitting, 
  setIsSubmitting 
}: GeneralRecommendationFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<{
    candidate_email: string;
    candidate_phone?: string;
    notes?: string;
  }>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: {
      candidate_email: "",
      candidate_phone: "",
      notes: "",
    },
  });

  const onSubmit = async (data: {
    candidate_email: string;
    candidate_phone?: string;
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

      // Check if candidate is already recommended and recommendation is valid
      const status = await fetchRecommendationStatus(data.candidate_email);
      if (status.exists && !status.isExpired) {
        toast({
          title: "Already Recommended",
          description: `This candidate was already recommended by ${status.recommendedBy || "another Virtual Recruiter"}. Recommendations are valid for 6 months.`,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          disabled={isSubmitting} 
          className="w-full bg-[#ea384c] hover:bg-[#d32d3f] text-white"
        >
          Submit General Recommendation
        </Button>
      </form>
    </Form>
  );
}
