
import { GraduationCap } from "lucide-react";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface ExperienceSectionProps {
  profile: CandidateProfile;
}

const ExperienceSection = ({ profile }: ExperienceSectionProps) => {
  return (
    <div>
      <h3 className="font-semibold flex items-center gap-2 mb-2">
        <GraduationCap className="h-4 w-4" />
        Experience & Skills
      </h3>
      <div className="space-y-2">
        <p>Years of Experience: {profile.years_experience}</p>
        <p>Salary Expectation: £{profile.min_salary.toLocaleString()} - £{profile.max_salary.toLocaleString()}</p>
        {profile.commission_percentage && (
          <p>Desired "You're Hired" Bonus: {profile.commission_percentage}%</p>
        )}
      </div>
    </div>
  );
};

export default ExperienceSection;
