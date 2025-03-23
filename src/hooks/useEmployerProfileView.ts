
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

    async function fetchEmployerProfile(): Promise<EmployerProfile | null> {
      try {
        const { data, error } = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', employerId)
          .single();
        
        if (error) {
          console.error('Error fetching employer profile:', error);
          return null;
        }
        
        if (data) {
          return {
            id: data.id,
            company_name: data.company_name,
            company_website: data.company_website,
            company_logo_url: data.company_logo_url,
            profile_picture_url: data.profile_picture_url,
            full_name: data.full_name,
            job_title: data.job_title,
            company_size: data.company_size,
            is_sme: data.is_sme,
            company_description: data.company_description,
            office_amenities: data.office_amenities,
            nearby_amenities: data.nearby_amenities,
            created_at: data.created_at,
            updated_at: data.updated_at
          };
        }
        
        return null;
      } catch (error) {
        console.error('Error in fetchEmployerProfile:', error);
        return null;
      }
    }

    async function fetchGalleryImages(): Promise<CompanyGalleryImage[]> {
      try {
        const { data, error } = await supabase
          .from('company_gallery')
          .select('*')
          .eq('employer_id', employerId);
        
        if (error) {
          console.error('Error fetching gallery images:', error);
          return [];
        }
        
        if (data) {
          return data.map(item => ({
            id: item.id,
            employer_id: item.employer_id,
            image_url: item.image_url,
            created_at: item.created_at
          }));
        }
        
        return [];
      } catch (error) {
        console.error('Error in fetchGalleryImages:', error);
        return [];
      }
    }

    async function checkForMatch(): Promise<boolean> {
      if (previewMode) {
        return true;
      }
      
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user?.id) {
          return false;
        }
        
        const userId = sessionData.session.user.id;
        
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
        
        return Array.isArray(data) && data.length > 0;
      } catch (error) {
        console.error('Error in checkForMatch:', error);
        return false;
      }
    }

    async function loadAllData(): Promise<void> {
      try {
        setLoading(true);
        
        // Run all data fetching in parallel for better performance
        const [profileData, galleryData, matchResult] = await Promise.all([
          fetchEmployerProfile(),
          fetchGalleryImages(),
          checkForMatch()
        ]);
        
        if (profileData) {
          setProfile(profileData);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load employer profile",
          });
        }
        
        setGalleryImages(galleryData);
        setHasMatch(matchResult);
      } catch (err) {
        console.error('Error in loadAllData:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employer profile",
        });
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, [employerId, toast, previewMode, navigate]);
  
  return { loading, profile, galleryImages, hasMatch };
};
