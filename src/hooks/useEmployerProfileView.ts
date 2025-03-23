
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
    async function fetchEmployerProfile() {
      try {
        if (!employerId) return;
        
        // Fetch employer profile
        const { data, error } = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', employerId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Cast data to EmployerProfile type before setting state
          const typedProfile: EmployerProfile = {
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
          
          setProfile(typedProfile);
          
          // Fetch gallery images
          const galleryResponse = await supabase
            .from('company_gallery')
            .select('*')
            .eq('employer_id', employerId);
            
          if (galleryResponse.error) throw galleryResponse.error;
          
          if (galleryResponse.data) {
            // Convert each item to CompanyGalleryImage type
            const typedGalleryImages: CompanyGalleryImage[] = galleryResponse.data.map(item => ({
              id: item.id,
              employer_id: item.employer_id,
              image_url: item.image_url,
              created_at: item.created_at
            }));
            
            setGalleryImages(typedGalleryImages);
          }
          
          // Check if there's a match with this employer (if not in preview mode)
          if (!previewMode) {
            const sessionResponse = await supabase.auth.getSession();
            const session = sessionResponse.data.session;
            
            if (session) {
              // Manual query approach to avoid complex type inference
              await checkMatchStatus(session.user.id, employerId);
            }
          }
        }
      } catch (error: any) {
        console.error('Error fetching employer profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employer profile",
        });
      } finally {
        setLoading(false);
      }
    }
    
    // Helper function that uses a different approach to check for matches
    async function checkMatchStatus(userId: string, empId: string) {
      try {
        // Using raw SQL as string literal to avoid TypeScript complexity
        const matchResponse = await supabase
          .from('applications')
          .select()
          .eq('applicant_id', userId)
          .eq('employer_id', empId)
          .eq('status', 'matched')
          .limit(1);
          
        if (matchResponse.error) {
          console.error('Error checking match status:', matchResponse.error);
          setHasMatch(false);
          return;
        }
        
        const matchData = matchResponse.data;
        setHasMatch(matchData && matchData.length > 0);
      } catch (err) {
        console.error('Error in match status check:', err);
        setHasMatch(false);
      }
    }
    
    fetchEmployerProfile();
  }, [employerId, toast, previewMode, navigate]);
  
  return { loading, profile, galleryImages, hasMatch };
};
