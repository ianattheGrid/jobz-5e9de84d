
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
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [galleryImages, setGalleryImages] = useState<CompanyGalleryImage[]>([]);
  const [hasMatch, setHasMatch] = useState<boolean>(previewMode);

  useEffect(() => {
    // Skip fetching data if no employerId is provided
    if (!employerId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        
        // If in preview mode, we only need to fetch profile and gallery
        if (previewMode) {
          const profileData = await fetchEmployerProfile(employerId);
          const imagesData = await fetchGalleryImages(employerId);
          
          setProfile(profileData);
          setGalleryImages(imagesData);
          setHasMatch(true); // Always true in preview mode
        } else {
          // For normal mode, fetch everything including match status
          const [profileData, imagesData, matchStatus] = await Promise.all([
            fetchEmployerProfile(employerId),
            fetchGalleryImages(employerId),
            checkEmployerMatch(employerId)
          ]);
          
          setProfile(profileData);
          setGalleryImages(imagesData);
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

    loadData();
  }, [employerId, previewMode, toast]);

  return { loading, profile, galleryImages, hasMatch };
};
