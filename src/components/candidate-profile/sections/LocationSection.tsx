
import { MapPin } from "lucide-react";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface LocationSectionProps {
  profile: CandidateProfile;
}

const LocationSection = ({ profile }: LocationSectionProps) => {
  return (
    <div>
      <h3 className="font-semibold flex items-center gap-2 mb-2">
        <MapPin className="h-4 w-4" />
        Location & Work Details
      </h3>
      <div className="space-y-2">
        {profile.location?.length > 0 && (
          <p>Location: {profile.location.join(", ")}</p>
        )}
        {profile.preferred_work_type && (
          <p>Preferred Work Type: {profile.preferred_work_type}</p>
        )}
        {profile.work_eligibility && (
          <p>Work Eligibility: {profile.work_eligibility}</p>
        )}
        {profile.availability && (
          <p>Availability: {profile.availability}</p>
        )}
      </div>
    </div>
  );
};

export default LocationSection;
