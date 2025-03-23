
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { EmployerProfile, CompanyGalleryImage } from "@/types/employer";

interface UseEmployerProfileViewProps {
  employerId?: string;
  previewMode?: boolean;
}

interface UseEmployerProfileViewResult {
  loading: boolean;
  profile: EmployerProfile | null;
  galleryImages: CompanyGalleryImage[];
  hasMatch: boolean;
}

export const useEmployerProfileView = ({ 
  employerId, 
  previewMode = false 
}: UseEmployerProfileViewProps): UseEmployerProfileViewResult => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [galleryImages, setGalleryImages] = useState<CompanyGalleryImage[]>([]);
  const [hasMatch, setHasMatch] = useState(previewMode);
  
  useEffect(() => {
    if (!employerId) {
      setLoading(false);
      return;
    }

    // Declare all functions outside the main fetch flow to avoid deep type instantiation
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', employerId)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching employer profile:', error);
        return null;
      }
    };

    const fetchGalleryImages = async () => {
      try {
        const { data, error } = await supabase
          .from('company_gallery')
          .select('*')
          .eq('employer_id', employerId);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        return [];
      }
    };

    const checkMatchStatus = async (userId: string) => {
      try {
        // Simple query with no chaining to avoid type inference issues
        const { data, error } = await supabase
          .from('applications')
          .select('id')
          .eq('applicant_id', userId)
          .eq('employer_id', employerId)
          .eq('status', 'matched');
        
        if (error) {
          console.error('Error checking match status:', error);
          return false;
        }
        
        // Simple existence check
        return Boolean(data && data.length > 0);
      } catch (error) {
        console.error('Error in match status check:', error);
        return false;
      }
    };

    // Main function to coordinate all data fetching
    const loadAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile
        const profileData = await fetchProfile();
        
        if (!profileData) {
          setLoading(false);
          return;
        }
        
        // Create typed profile object
        const typedProfile: EmployerProfile = {
          id: profileData.id,
          company_name: profileData.company_name,
          company_website: profileData.company_website,
          company_logo_url: profileData.company_logo_url,
          profile_picture_url: profileData.profile_picture_url,
          full_name: profileData.full_name,
          job_title: profileData.job_title,
          company_size: profileData.company_size,
          is_sme: profileData.is_sme,
          company_description: profileData.company_description,
          office_amenities: profileData.office_amenities,
          nearby_amenities: profileData.nearby_amenities,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        };
        
        setProfile(typedProfile);
        
        // Fetch gallery images
        const galleryData = await fetchGalleryImages();
        
        if (galleryData.length > 0) {
          const typedGalleryImages: CompanyGalleryImage[] = galleryData.map(item => ({
            id: item.id,
            employer_id: item.employer_id,
            image_url: item.image_url,
            created_at: item.created_at
          }));
          
          setGalleryImages(typedGalleryImages);
        }
        
        // Check for match if not in preview mode
        if (!previewMode) {
          const { data } = await supabase.auth.getSession();
          const session = data.session;
          
          if (session) {
            const hasMatch = await checkMatchStatus(session.user.id);
            setHasMatch(hasMatch);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employer profile",
        });
      } finally {
        setLoading(false);
      }
    };

    // Start the data loading process
    loadAllData();
  }, [employerId, toast, previewMode, navigate]);
  
  return { loading, profile, galleryImages, hasMatch };
};
