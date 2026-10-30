import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { BETA_PREVIEW } from "@/lib/beta";
import { useBetaPreview } from "@/components/beta/BetaPreview";

export const useAuthenticationCheck = () => {
  const { openInterest } = useBetaPreview();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthentication = async () => {
    if (BETA_PREVIEW) { openInterest(); return false; }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const redirectTo = encodeURIComponent(location.pathname + location.search);
      toast({
        title: "Sign in to apply",
        description: "Takes about 10 seconds — we'll bring you right back to this job.",
      });
      navigate(`/candidate/signin?redirect=${redirectTo}`);
      return false;
    }
    return session;
  };

  return checkAuthentication;
};

export const useProfileCheck = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile before applying.",
        variant: "destructive",
      });
      navigate('/candidate/profile');
      return false;
    }
    return profile;
  };

  return checkProfile;
};