
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VRProfile {
  full_name: string;
  email: string;
  location: string;
  vr_number: string;
  bank_account_verified: boolean;
  national_insurance_number: string | null;
}

export const useVRProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<VRProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/vr/signin');
          return;
        }

        // Get user role to verify VR access
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
          
        if (!userRole || userRole.role !== 'vr') {
          toast({
            variant: "destructive",
            title: "Access Error",
            description: "You do not have Virtual Recruiter access."
          });
          navigate('/');
          return;
        }

        const { data, error } = await supabase
          .from('virtual_recruiter_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile({
            full_name: data.full_name || "",
            email: data.email || "",
            location: data.location || "",
            vr_number: data.vr_number || "",
            bank_account_verified: data.bank_account_verified || false,
            national_insurance_number: data.national_insurance_number,
          });
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load profile",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, toast]);

  const updateProfile = async (values: Partial<VRProfile>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to update your profile"
        });
        return;
      }

      const { error } = await supabase
        .from('virtual_recruiter_profiles')
        .update({
          full_name: values.full_name,
          location: values.location,
          national_insurance_number: values.national_insurance_number,
        })
        .eq('id', session.user.id);

      if (error) throw error;

      if (profile) {
        setProfile({
          ...profile,
          ...values,
        });
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    }
  };

  return { profile, loading, updateProfile };
};
