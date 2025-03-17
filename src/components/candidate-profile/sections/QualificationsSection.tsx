
import { Shield, Award, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex items-center space-x-2 mb-4">
        <Award className="h-5 w-5 text-blue-500" />
        <h3 className="text-xl font-semibold">Qualifications & Security</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile.required_qualifications && profile.required_qualifications.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-gray-600" />
              <span className="font-medium">Qualifications</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.required_qualifications.map((qual, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {qual}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {profile.security_clearance && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-600" />
              <span className="font-medium">Security Clearance</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {profile.security_clearance}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualificationsSection;
