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
  successful_placements: number | null;
  recommendations_count: number | null;
}

export const useVRProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<VRProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No active session found, redirecting to login');
          navigate('/vr/signin');
          return;
        }

        // Get user role to verify VR access
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
          
        if (roleError) {
          console.error('Error fetching user role:', roleError);
          throw new Error('Failed to verify your account type');
        }
          
        if (!userRole || userRole.role !== 'vr') {
          console.error('User is not a VR:', userRole?.role);
          toast({
            variant: "destructive",
            title: "Access Error",
            description: "You do not have Connector access."
          });
          navigate('/');
          return;
        }

        // Fetch VR profile
        const { data, error } = await supabase
          .from('virtual_recruiter_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching VR profile:', error);
          if (error.code === 'PGRST116') {
            // Profile not found
            toast({
              variant: "destructive",
              title: "Profile Not Found",
              description: "Your Connector profile hasn't been set up correctly."
            });
          } else {
            throw error;
          }
        }

        if (data) {
          setProfile({
            full_name: data.full_name || "",
            email: data.email || "",
            location: data.location || "",
            vr_number: data.vr_number || "",
            bank_account_verified: data.bank_account_verified || false,
            national_insurance_number: data.national_insurance_number,
            successful_placements: data.successful_placements || null,
            recommendations_count: data.recommendations_count || null,
          });
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
        setError(error.message || "Failed to load profile");
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile };
};
