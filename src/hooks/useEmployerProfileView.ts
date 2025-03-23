
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

    // Use an async function inside useEffect
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch profile
      let profileData = null;
      try {
        profileData = await fetchEmployerProfile(employerId);
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employer profile",
        });
      }
      
      // Fetch gallery images
      try {
        const imagesData = await fetchGalleryImages(employerId);
        setGalleryImages(imagesData);
      } catch (error) {
        console.error("Error fetching gallery:", error);
        // Don't show a toast as this is non-critical
      }
      
      // Check match status if not in preview mode
      if (!previewMode) {
        try {
          const matchStatus = await checkEmployerMatch(employerId);
          setHasMatch(matchStatus);
        } catch (error) {
          console.error("Error checking match:", error);
          // Default to false if there's an error
          setHasMatch(false);
        }
      }
      
      setLoading(false);
    };

    fetchData();
  }, [employerId, previewMode, toast]);

  return { loading, profile, galleryImages, hasMatch };
};
