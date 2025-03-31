
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
  vrId?: string;
  status: string;
  startDate?: Date;
  paymentDueDate?: Date;
  vrRecommended: boolean;
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
        
        // Get candidate email
        const { data: candidateData, error: candidateError } = await supabase
          .from('candidate_profiles')
          .select('email')
          .eq('id', applicationData.applicant_id)
          .single();
          
        if (candidateError) throw candidateError;
        
        // First check for job-specific recommendation
        const { data: jobSpecificRec, error: jobSpecificError } = await supabase
          .from('candidate_recommendations')
          .select('id, vr_id')
          .eq('candidate_email', candidateData.email)
          .eq('job_id', applicationData.job_id)
          .maybeSingle();
        
        if (jobSpecificError) {
          console.error('Error fetching job-specific recommendation:', jobSpecificError);
        }
        
        let vrData = jobSpecificRec ? 
          { recommendationId: jobSpecificRec.id, vrId: jobSpecificRec.vr_id } : 
          null;
          
        // If no job-specific recommendation, find the first/earliest recommendation for this candidate
        if (!vrData) {
          const { data: earliestRec } = await supabase
            .from('candidate_recommendations')
            .select('id, vr_id')
            .eq('candidate_email', candidateData.email)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();
            
          if (earliestRec) {
            vrData = { recommendationId: earliestRec.id, vrId: earliestRec.vr_id };
            console.log('Found earliest recommendation:', vrData);
          } else {
            // As last resort, check vr_referrals
            const { data: referral } = await supabase
              .from('vr_referrals')
              .select('vr_id')
              .eq('candidate_email', candidateData.email)
              .eq('status', 'completed')
              .order('created_at', { ascending: true })
              .limit(1)
              .maybeSingle();
              
            if (referral) {
              vrData = { vrId: referral.vr_id, recommendationId: undefined };
              console.log('Found referral:', vrData);
            }
          }
        }
        
        // Check if a bonus payment record already exists
        const { data: existingPayment, error: paymentError } = await supabase
          .from('bonus_payments')
          .select('*')
          .eq('job_id', applicationData.job_id)
          .eq('candidate_id', applicationData.applicant_id)
          .maybeSingle();
        
        if (paymentError) {
          console.error('Error fetching existing payment:', paymentError);
        }
          
        // Calculate candidate and VR commissions
        const hasJobCommission = applicationData.jobs.candidate_commission !== null && 
                                applicationData.jobs.candidate_commission > 0;
        
        // Default values
        let totalCommission = hasJobCommission ? applicationData.jobs.candidate_commission : 0;
        let candidateCommission = totalCommission;
        let vrCommission = 0;
        
        // If VR recommendation exists but job doesn't have commission specified
        // Apply the minimum 2.5% of salary rule for VR
        if (vrData && !hasJobCommission) {
          // Get job details to calculate default commission based on salary
          const { data: jobData } = await supabase
            .from('jobs')
            .select('salary_min, salary_max')
            .eq('id', applicationData.job_id)
            .single();
            
          if (jobData) {
            // Calculate average salary to estimate commission (2.5% of avg salary)
            const avgSalary = (jobData.salary_min + jobData.salary_max) / 2;
            const defaultCommission = Math.round(avgSalary * 0.025); // 2.5% default VR commission
            
            // Set values
            totalCommission = defaultCommission;
            vrCommission = defaultCommission;
            candidateCommission = 0; // No candidate commission in this case
          }
        } 
        // If there's both a VR recommendation and job has commission configured
        else if (vrData && hasJobCommission) {
          // Standard 70/30 split for now
          vrCommission = totalCommission * 0.3; // 30% to VR
          candidateCommission = totalCommission - vrCommission; // 70% to candidate
        }
        
        setBonusData({
          jobId: applicationData.job_id,
          candidateId: applicationData.applicant_id,
          candidateEmail: candidateData.email,
          candidateCommission: candidateCommission,
          vrCommission: vrCommission > 0 ? vrCommission : undefined,
          recommendationId: vrData?.recommendationId,
          vrId: vrData?.vrId,
          status: existingPayment ? existingPayment.payment_status : 'not_started',
          startDate: existingPayment?.start_date ? new Date(existingPayment.start_date) : undefined,
          paymentDueDate: existingPayment?.payment_due_date ? new Date(existingPayment.payment_due_date) : undefined,
          vrRecommended: vrData !== null
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
