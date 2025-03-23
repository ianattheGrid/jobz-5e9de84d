
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
    const fetchEmployerProfile = async () => {
      try {
        if (!employerId) return;
        
        const { data, error } = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', employerId)
          .single();
        
        if (error) throw error;
        if (data) {
          // Explicitly cast the data to EmployerProfile type
          setProfile(data as EmployerProfile);
          
          // Fetch gallery images
          const { data: galleryData, error: galleryError } = await supabase
            .from('company_gallery')
            .select('*')
            .eq('employer_id', employerId);
            
          if (galleryError) throw galleryError;
          if (galleryData) {
            // Explicitly cast gallery data to CompanyGalleryImage[] type
            setGalleryImages(galleryData as CompanyGalleryImage[]);
          }
          
          // Check if there's a match with this employer (if not in preview mode)
          if (!previewMode) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              const { data: matchData } = await supabase
                .from('applications')
                .select('id')
                .eq('candidate_id', session.user.id)
                .eq('status', 'matched')
                .eq('employer_id', employerId)
                .limit(1);
                
              setHasMatch(matchData && matchData.length > 0);
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
    };
    
    fetchEmployerProfile();
  }, [employerId, toast, previewMode]);
  
  return { loading, profile, galleryImages, hasMatch };
};
