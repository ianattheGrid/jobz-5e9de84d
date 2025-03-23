
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { EmployerProfile, CompanyGalleryImage } from "@/types/employer";
import { 
  fetchEmployerProfile, 
  fetchGalleryImages, 
  checkEmployerMatch 
} from "@/services/employerProfileService";

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
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [galleryImages, setGalleryImages] = useState<CompanyGalleryImage[]>([]);
  const [hasMatch, setHasMatch] = useState(previewMode);

  useEffect(() => {
    // Skip fetching data if no employerId is provided
    if (!employerId) {
      setLoading(false);
      return;
    }

    const loadProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const profileData = await fetchEmployerProfile(employerId);
        setProfile(profileData);
        
        // Fetch gallery images
        const imagesData = await fetchGalleryImages(employerId);
        setGalleryImages(imagesData);
        
        // Check match status if not in preview mode
        if (!previewMode) {
          const matchStatus = await checkEmployerMatch(employerId);
          setHasMatch(matchStatus);
        }
      } catch (error) {
        console.error("Error loading employer profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employer profile",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [employerId, previewMode, toast]);

  return { loading, profile, galleryImages, hasMatch };
};
