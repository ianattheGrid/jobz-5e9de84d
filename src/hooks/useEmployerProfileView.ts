
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

    // Define async function to fetch all data
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Step 1: Fetch employer profile
        const profileData = await fetchEmployerProfile(employerId);
        setProfile(profileData);
        
        // Step 2: Fetch gallery images
        const imagesData = await fetchGalleryImages(employerId);
        setGalleryImages(imagesData || []);
        
        // Step 3: Check match status if not in preview mode
        if (!previewMode) {
          const matchStatus = await checkEmployerMatch(employerId);
          setHasMatch(matchStatus);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
      } finally {
        setLoading(false);
      }
    };

    // Call the async function
    fetchData();
  }, [employerId, previewMode, toast]);

  return { 
    loading, 
    profile, 
    galleryImages, 
    hasMatch 
  };
};
