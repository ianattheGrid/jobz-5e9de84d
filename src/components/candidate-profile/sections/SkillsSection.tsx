
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface SkillsSectionProps {
  profile: CandidateProfile;
}

const SkillsSection = ({ profile }: SkillsSectionProps) => {
  if (!profile.additional_skills) {
    return null;
  }

  return (
    <div>
      {profile.additional_skills && (
        <div>
          <h3 className="font-semibold mb-2">Additional Skills & Certifications</h3>
          <p>{profile.additional_skills}</p>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
