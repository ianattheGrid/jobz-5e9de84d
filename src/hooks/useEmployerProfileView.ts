
import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [galleryImages, setGalleryImages] = useState<CompanyGalleryImage[]>([]);
  const [hasMatch, setHasMatch] = useState<boolean>(previewMode);

  useEffect(() => {
    const fetchData = async () => {
      // If no employerId is provided, return early
      if (!employerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch employer profile
        const profileResponse = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', employerId)
          .single();
          
        if (profileResponse.error) {
          throw new Error(profileResponse.error.message);
        }

        const profileData = profileResponse.data;
        
        // Fetch gallery images
        const galleryResponse = await supabase
          .from('company_gallery')
          .select('*')
          .eq('employer_id', employerId);
          
        // Check for match if not in preview mode
        let matchStatus = previewMode;
        
        if (!previewMode) {
          const sessionResponse = await supabase.auth.getSession();
          const userId = sessionResponse?.data?.session?.user?.id;
          
          if (userId) {
            const matchResponse = await supabase
              .from('applications')
              .select('id')
              .eq('applicant_id', userId)
              .eq('employer_id', employerId)
              .eq('status', 'matched');
              
            if (!matchResponse.error && matchResponse.data && matchResponse.data.length > 0) {
              matchStatus = true;
            }
          }
        }
        
        // Format and set profile data
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
        
        // Format and set gallery images
        if (galleryResponse.data) {
          setGalleryImages(
            galleryResponse.data.map(item => ({
              id: item.id,
              employer_id: item.employer_id,
              image_url: item.image_url,
              created_at: item.created_at
            }))
          );
        }
        
        setHasMatch(matchStatus);
      } catch (error) {
        console.error("Error fetching employer profile data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employer profile",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employerId, previewMode, toast]);

  return { loading, profile, galleryImages, hasMatch };
};
