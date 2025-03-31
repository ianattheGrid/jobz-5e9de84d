
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useApplicationTracking = (jobId: number, candidateEmail: string) => {
  const [loading, setLoading] = useState(true);
  const [hasVrReferral, setHasVrReferral] = useState(false);
  const [vrInfo, setVrInfo] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    const checkReferrals = async () => {
      if (!jobId || !candidateEmail) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check for a job-specific recommendation
        const { data: jobSpecificRec, error: recError } = await supabase
          .from('candidate_recommendations')
          .select('vr_id')
          .eq('candidate_email', candidateEmail)
          .eq('job_id', jobId)
          .maybeSingle();
        
        if (recError) {
          console.error('Error checking recommendations:', recError);
          return;
        }
        
        // If no job-specific recommendation found, check for general recommendation
        if (!jobSpecificRec) {
          const { data: generalRec, error: genError } = await supabase
            .from('candidate_recommendations')
            .select('vr_id')
            .eq('candidate_email', candidateEmail)
            .is('job_id', null)
            .maybeSingle();
            
          if (genError) {
            console.error('Error checking general recommendations:', genError);
            return;
          }
          
          if (generalRec) {
            setHasVrReferral(true);
            await loadVrInfo(generalRec.vr_id);
            return;
          }
        } else {
          setHasVrReferral(true);
          await loadVrInfo(jobSpecificRec.vr_id);
          return;
        }
        
        // If no recommendations found, check vr_referrals table
        const { data: referral, error: refError } = await supabase
          .from('vr_referrals')
          .select('vr_id')
          .eq('candidate_email', candidateEmail)
          .eq('status', 'completed')
          .maybeSingle();
          
        if (refError) {
          console.error('Error checking referrals:', refError);
          return;
        }
        
        if (referral) {
          setHasVrReferral(true);
          await loadVrInfo(referral.vr_id);
        }
        
      } catch (err) {
        console.error('Error in application tracking:', err);
      } finally {
        setLoading(false);
      }
    };
    
    const loadVrInfo = async (vrId: string) => {
      try {
        const { data: vrProfile, error: vrError } = await supabase
          .from('virtual_recruiter_profiles')
          .select('id, full_name')
          .eq('id', vrId)
          .single();
          
        if (vrError) {
          console.error('Error loading VR profile:', vrError);
          return;
        }
        
        if (vrProfile) {
          setVrInfo({
            id: vrProfile.id,
            name: vrProfile.full_name
          });
        }
      } catch (err) {
        console.error('Error loading VR info:', err);
      }
    };

    checkReferrals();
  }, [jobId, candidateEmail]);

  return {
    loading,
    hasVrReferral,
    vrInfo
  };
};
