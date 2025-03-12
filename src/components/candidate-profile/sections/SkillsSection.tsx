
import { Briefcase } from "lucide-react";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface SkillsSectionProps {
  profile: CandidateProfile;
}

const SkillsSection = ({ profile }: SkillsSectionProps) => {
  if (!profile.required_skills?.length && !profile.additional_skills) {
    return null;
  }

  return (
    <div>
      {profile.required_skills && profile.required_skills.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Technical Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.required_skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
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
