
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

    // Define a simple async function to load all data
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
          console.error('Error fetching employer profile:', profileError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load employer profile",
          });
          setLoading(false);
          return;
        }

        if (profileData) {
          // Cast to EmployerProfile type
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
        }

        // Fetch gallery images
        const { data: galleryData, error: galleryError } = await supabase
          .from('company_gallery')
          .select('*')
          .eq('employer_id', employerId);
        
        if (galleryError) {
          console.error('Error fetching gallery images:', galleryError);
        } else if (galleryData) {
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
          const { data: sessionData } = await supabase.auth.getSession();
          const session = sessionData?.session;
          
          if (session?.user?.id) {
            const userId = session.user.id;
            
            // Simple query to check for match
            const { data: matchData, error: matchError } = await supabase
              .from('applications')
              .select('id')
              .eq('applicant_id', userId)
              .eq('employer_id', employerId)
              .eq('status', 'matched');
            
            if (matchError) {
              console.error('Error checking match status:', matchError);
            } else {
              // If matchData exists and has length, there is a match
              setHasMatch(matchData && matchData.length > 0);
            }
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

    // Call the load data function
    loadData();
  }, [employerId, toast, previewMode, navigate]);
  
  return { loading, profile, galleryImages, hasMatch };
};
