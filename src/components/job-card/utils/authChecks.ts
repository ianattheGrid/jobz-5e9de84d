import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useAuthenticationCheck = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkAuthentication = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign up or sign in to apply for jobs.",
        variant: "destructive",
      });
      navigate('/candidate/signup');
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