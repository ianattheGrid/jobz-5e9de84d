
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
      
      <div className="mt-4 p-4 border border-amber-200 bg-amber-50 rounded-md">
        <p className="text-amber-700 text-sm">
          The skills section has been temporarily removed while we work on improving it.
        </p>
      </div>
    </div>
  );
};

export default SkillsSection;
