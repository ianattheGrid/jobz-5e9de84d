
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

// Fetch application data including job ID, applicant ID, and status
const fetchApplicationData = async (applicationId: number) => {
  const { data, error } = await supabase
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
    
  if (error) throw error;
  return data;
};

// Fetch candidate email from their profile
const fetchCandidateEmail = async (candidateId: string) => {
  const { data, error } = await supabase
    .from('candidate_profiles')
    .select('email')
    .eq('id', candidateId)
    .single();
    
  if (error) throw error;
  return data.email;
};

// Check for job-specific recommendation
const findJobSpecificRecommendation = async (candidateEmail: string, jobId: number) => {
  const { data, error } = await supabase
    .from('candidate_recommendations')
    .select('id, vr_id')
    .eq('candidate_email', candidateEmail)
    .eq('job_id', jobId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching job-specific recommendation:', error);
  }
  
  return data ? { recommendationId: data.id, vrId: data.vr_id } : null;
};

// Find earliest recommendation for candidate
const findEarliestRecommendation = async (candidateEmail: string) => {
  const { data } = await supabase
    .from('candidate_recommendations')
    .select('id, vr_id')
    .eq('candidate_email', candidateEmail)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
    
  return data ? { recommendationId: data.id, vrId: data.vr_id } : null;
};

// Check for completed VR referral if no recommendation found
const findCompletedReferral = async (candidateEmail: string) => {
  const { data } = await supabase
    .from('vr_referrals')
    .select('vr_id')
    .eq('candidate_email', candidateEmail)
    .eq('status', 'completed')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
    
  return data ? { vrId: data.vr_id, recommendationId: undefined } : null;
};

// Check if payment record already exists
const checkExistingPayment = async (jobId: number, candidateId: string) => {
  const { data, error } = await supabase
    .from('bonus_payments')
    .select('*')
    .eq('job_id', jobId)
    .eq('candidate_id', candidateId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching existing payment:', error);
  }
  
  return data;
};

// Calculate commission distribution based on VR involvement and job configuration
const calculateCommissions = async (
  hasJobCommission: boolean,
  jobCommission: number,
  vrData: { recommendationId?: number; vrId?: string } | null,
  jobId: number
) => {
  let totalCommission = hasJobCommission ? jobCommission : 0;
  let candidateCommission = totalCommission;
  let vrCommission = 0;
  
  // If VR recommendation exists but job doesn't have commission specified
  // Apply the minimum 2.5% of salary rule for VR
  if (vrData && !hasJobCommission) {
    // Get job details to calculate default commission based on salary
    const { data: jobData } = await supabase
      .from('jobs')
      .select('salary_min, salary_max')
      .eq('id', jobId)
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
  
  return { candidateCommission, vrCommission, totalCommission };
};

// The main hook that uses all the utility functions
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
        const applicationData = await fetchApplicationData(applicationId);
        
        // Get candidate email
        const candidateEmail = await fetchCandidateEmail(applicationData.applicant_id);
        
        // Check for job-specific recommendation first
        let vrData = await findJobSpecificRecommendation(candidateEmail, applicationData.job_id);
        
        // If no job-specific recommendation, find earliest recommendation
        if (!vrData) {
          vrData = await findEarliestRecommendation(candidateEmail);
          
          // As last resort, check vr_referrals
          if (!vrData) {
            vrData = await findCompletedReferral(candidateEmail);
          }
        }
        
        // Check if a bonus payment record already exists
        const existingPayment = await checkExistingPayment(
          applicationData.job_id, 
          applicationData.applicant_id
        );
        
        // Calculate candidate and VR commissions
        const hasJobCommission = applicationData.jobs.candidate_commission !== null && 
                              applicationData.jobs.candidate_commission > 0;
        
        const { candidateCommission, vrCommission } = await calculateCommissions(
          hasJobCommission,
          applicationData.jobs.candidate_commission,
          vrData,
          applicationData.job_id
        );
        
        // Set the bonus data
        setBonusData({
          jobId: applicationData.job_id,
          candidateId: applicationData.applicant_id,
          candidateEmail,
          candidateCommission,
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
