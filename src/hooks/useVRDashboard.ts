
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useVRDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserAndProfile = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/vr/signin');
          return;
        }

        console.log('Session found, user authenticated:', session.user.id);

        // Check for existing profile
        const { data: existingProfile, error: profileError } = await supabase
          .from('virtual_recruiter_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching VR profile:', profileError);
          setError('Failed to load your profile information. Please try again later.');
          setLoading(false);
          return;
        }

        // If profile doesn't exist, create it
        if (!existingProfile) {
          try {
            console.log('Creating missing VR profile for user:', session.user.id);
            
            // Get user's role to verify they should have VR access
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .maybeSingle();
              
            if (!roleData || roleData.role !== 'vr') {
              console.error('User does not have VR role:', roleData);
              setError('You do not have Virtual Recruiter permissions. Please contact support.');
              setLoading(false);
              return;
            }

            console.log('User has VR role, creating profile');
            
            // Insert profile with required fields
            const { data: newProfile, error: createError } = await supabase
              .from('virtual_recruiter_profiles')
              .insert([{  // Use array notation for insert
                id: session.user.id,
                full_name: session.user.user_metadata.full_name || 'New User',
                email: session.user.email || '',
                location: 'Not specified',
                bank_account_verified: false,
                is_active: true
              }] as any)  // Type assertion needed because vr_number is DB generated
              .select('*')
              .single();
            
            if (createError) {
              console.error('Error creating VR profile:', createError);
              setError(`Failed to create your profile: ${createError.message}`);
              setLoading(false);
              return;
            }
            
            console.log('Profile created successfully:', newProfile);
            setProfile(newProfile);
            
            toast({
              title: "Profile Created",
              description: "Your Virtual Recruiter profile has been created successfully."
            });
          } catch (err: any) {
            console.error('Error in profile creation:', err);
            setError(`Failed to create your profile: ${err?.message || 'Unknown error'}`);
            setLoading(false);
            return;
          }
        } else {
          console.log('Existing profile found:', existingProfile);
          setProfile(existingProfile);
        }

        setLoading(false);
      } catch (err: any) {
        console.error('Dashboard loading error:', err);
        setError(`An unexpected error occurred: ${err?.message || 'Please try again later.'}`);
        setLoading(false);
      }
    };

    loadUserAndProfile();
  }, [navigate, toast]);

  // Calculate stats from profile data
  const stats = {
    totalReferrals: profile?.recommendations_count || 0,
    successfulPlacements: profile?.successful_placements || 0,
    pendingRecommendations: (profile?.recommendations_count || 0) - (profile?.successful_placements || 0)
  };

  return { 
    loading, 
    error, 
    profile,
    stats
  };
};
