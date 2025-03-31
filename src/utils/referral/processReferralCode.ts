
import { supabase } from "@/integrations/supabase/client";

export const processReferralCode = async (
  referralCode: string | undefined, 
  userId: string,
  email: string
) => {
  if (!referralCode) return;
  
  console.log(`Referral code provided: ${referralCode}. Updating vr_referrals...`);
  const { error: refError } = await supabase
    .from('vr_referrals')
    .update({
      status: 'completed',
      signed_up_at: new Date().toISOString(),
      candidate_id: userId
    })
    .eq('referral_code', referralCode)
    .eq('candidate_email', email);
    
  if (refError) {
    console.error('Error updating referral:', refError);
  }
};
