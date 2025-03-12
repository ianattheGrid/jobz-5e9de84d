
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";
import LocationSection from "./sections/LocationSection";
import ExperienceSection from "./sections/ExperienceSection";
import QualificationsSection from "./sections/QualificationsSection";
import SkillsSection from "./sections/SkillsSection";

interface ProfileDetailsProps {
  profile: CandidateProfile;
}

const ProfileDetails = ({ profile }: ProfileDetailsProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {profile.job_title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LocationSection profile={profile} />
          <ExperienceSection profile={profile} />
        </div>

        <QualificationsSection profile={profile} />
        <SkillsSection profile={profile} />
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
