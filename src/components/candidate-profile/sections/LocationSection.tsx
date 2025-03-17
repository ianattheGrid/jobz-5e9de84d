
import { MapPin, Briefcase, Clock, Globe } from "lucide-react";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface LocationSectionProps {
  profile: CandidateProfile;
}

const LocationSection = ({ profile }: LocationSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        {profile.location?.length > 0 && (
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Preferred Locations</h4>
              <p className="text-gray-700">{profile.location.join(", ")}</p>
            </div>
          </div>
        )}
        
        {profile.travel_radius && (
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Travel Radius</h4>
              <p className="text-gray-700">{profile.travel_radius} miles</p>
            </div>
          </div>
        )}
        
        {profile.home_postcode && (
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Home Postcode</h4>
              <p className="text-gray-700">{profile.home_postcode}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {profile.preferred_work_type && (
          <div className="flex items-start gap-2">
            <Briefcase className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Preferred Work Type</h4>
              <p className="text-gray-700">{profile.preferred_work_type}</p>
            </div>
          </div>
        )}
        
        {profile.availability && (
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Availability</h4>
              <p className="text-gray-700">{profile.availability}</p>
            </div>
          </div>
        )}
        
        {profile.work_eligibility && (
          <div className="flex items-start gap-2">
            <Globe className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Work Eligibility</h4>
              <p className="text-gray-700">{profile.work_eligibility}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSection;
