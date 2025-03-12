
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";

export const useSearchState = () => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const { toast } = useToast();

  const handleSearchError = () => {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to search candidates. Please try again.",
    });
  };

  const handleSearchSuccess = (validCandidateProfiles: CandidateProfile[]) => {
    setCandidates(validCandidateProfiles);
    toast({
      title: "Search Completed",
      description: `Found ${validCandidateProfiles.length} matching candidates.`,
    });
  };

  return { candidates, handleSearchError, handleSearchSuccess };
};
