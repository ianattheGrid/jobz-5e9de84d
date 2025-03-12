
import { Shield } from "lucide-react";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface QualificationsSectionProps {
  profile: CandidateProfile;
}

const QualificationsSection = ({ profile }: QualificationsSectionProps) => {
  if (!profile.required_qualifications?.length && !profile.security_clearance) {
    return null;
  }

  return (
    <div>
      <h3 className="font-semibold flex items-center gap-2 mb-2">
        <Shield className="h-4 w-4" />
        Qualifications & Security
      </h3>
      {profile.required_qualifications && profile.required_qualifications.length > 0 && (
        <div className="mb-4">
          <p className="font-medium">Qualifications:</p>
          <ul className="list-disc list-inside">
            {profile.required_qualifications.map((qual, index) => (
              <li key={index}>{qual}</li>
            ))}
          </ul>
        </div>
      )}
      {profile.security_clearance && (
        <p>Security Clearance: {profile.security_clearance}</p>
      )}
    </div>
  );
};

export default QualificationsSection;
