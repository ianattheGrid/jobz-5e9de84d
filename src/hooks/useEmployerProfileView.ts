
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
    // If no employerId is provided, return early
    if (!employerId) {
      setLoading(false);
      return;
    }

    // Main function to load all data
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch employer profile
        const { data: profileData, error: profileError } = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', employerId)
          .single();
          
        if (profileError) {
          console.error("Error fetching employer profile:", profileError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load employer profile",
          });
          setLoading(false);
          return;
        }
        
        // Fetch gallery images
        const { data: galleryData, error: galleryError } = await supabase
          .from('company_gallery')
          .select('*')
          .eq('employer_id', employerId);
          
        if (galleryError) {
          console.error("Error fetching gallery images:", galleryError);
        }
        
        // Check for match if not in preview mode
        let matchStatus = previewMode;
        
        if (!previewMode) {
          const { data: sessionData } = await supabase.auth.getSession();
          const userId = sessionData?.session?.user?.id;
          
          if (userId) {
            const { data: matchData, error: matchError } = await supabase
              .from('applications')
              .select('id')
              .eq('applicant_id', userId)
              .eq('employer_id', employerId)
              .eq('status', 'matched');
              
            if (!matchError && matchData && matchData.length > 0) {
              matchStatus = true;
            }
          }
        }
        
        // Format profile data if it exists
        if (profileData) {
          setProfile({
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
          });
        }
        
        // Format gallery images if they exist
        if (galleryData) {
          const formattedGalleryImages = galleryData.map(item => ({
            id: item.id,
            employer_id: item.employer_id,
            image_url: item.image_url,
            created_at: item.created_at
          }));
          setGalleryImages(formattedGalleryImages);
        }
        
        setHasMatch(matchStatus);
      } catch (err) {
        console.error("Error in loadData:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employer profile",
        });
      } finally {
        setLoading(false);
      }
    };

    // Load all data
    loadData();
  }, [employerId, toast, navigate, previewMode]);

  return { loading, profile, galleryImages, hasMatch };
};
