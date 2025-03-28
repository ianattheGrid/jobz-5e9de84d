
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BonusPaymentData {
  jobId: number;
  candidateId: string;
  candidateEmail: string;
  candidateCommission: number;
  vrCommission?: number;
  recommendationId?: number;
  status: string;
  startDate?: Date;
  paymentDueDate?: Date;
}

export const useBonusPayment = (applicationId: number) => {
  const [loading, setLoading] = useState(true);
  const [bonusData, setBonusData] = useState<BonusPaymentData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBonusData = async () => {
      if (!applicationId) return;
      
      try {
        setLoading(true);
        
        // Get application data
        const { data: applicationData, error: applicationError } = await supabase
          .from('applications')
          .select(`
            job_id,
            applicant_id,
            status,
            jobs!inner(
              candidate_commission
            )
          `)
          .eq('id', applicationId)
          .single();
          
        if (applicationError) throw applicationError;
        
        if (!applicationData || !applicationData.jobs.candidate_commission) {
          // No bonus configured for this job
          setLoading(false);
          return;
        }
        
        // Get candidate email
        const { data: candidateData, error: candidateError } = await supabase
          .from('candidate_profiles')
          .select('email')
          .eq('id', applicationData.applicant_id)
          .single();
          
        if (candidateError) throw candidateError;
        
        // Check if there's a VR recommendation for this candidate
        const { data: recommendationData } = await supabase
          .from('candidate_recommendations')
          .select('id, commission_percentage')
          .eq('candidate_email', candidateData.email)
          .eq('job_id', applicationData.job_id)
          .maybeSingle();
        
        // Check if a bonus payment record already exists
        const { data: existingPayment } = await supabase
          .from('bonus_payments')
          .select('*')
          .eq('job_id', applicationData.job_id)
          .eq('candidate_id', applicationData.applicant_id)
          .maybeSingle();
          
        // Calculate candidate and VR commissions
        const totalCommission = applicationData.jobs.candidate_commission;
        let candidateCommission = totalCommission;
        let vrCommission = 0;
        
        if (recommendationData && recommendationData.commission_percentage) {
          // If there's a VR, split the commission based on the percentage
          vrCommission = totalCommission * (recommendationData.commission_percentage / 100);
          candidateCommission = totalCommission - vrCommission;
        }
        
        setBonusData({
          jobId: applicationData.job_id,
          candidateId: applicationData.applicant_id,
          candidateEmail: candidateData.email,
          candidateCommission: candidateCommission,
          vrCommission: vrCommission > 0 ? vrCommission : undefined,
          recommendationId: recommendationData?.id,
          status: existingPayment ? existingPayment.payment_status : 'not_started',
          startDate: existingPayment?.start_date ? new Date(existingPayment.start_date) : undefined,
          paymentDueDate: existingPayment?.payment_due_date ? new Date(existingPayment.payment_due_date) : undefined
        });
      } catch (error: any) {
        console.error('Error fetching bonus data:', error);
        toast({
          variant: "destructive",
          title: "Error loading bonus information",
          description: error.message || "Failed to load bonus information."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBonusData();
  }, [applicationId, toast]);

  return {
    loading,
    bonusData
  };
};
