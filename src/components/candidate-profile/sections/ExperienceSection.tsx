
import { GraduationCap, Banknote } from "lucide-react";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface ExperienceSectionProps {
  profile: CandidateProfile;
}

const ExperienceSection = ({ profile }: ExperienceSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-pink-600" />
            <span className="font-medium text-gray-900">Professional Experience</span>
          </div>
          <p className="text-gray-700">{profile.years_experience} years in {profile.job_title || "current field"}</p>
          
          {profile.years_in_current_title && (
            <p className="text-gray-700">{profile.years_in_current_title} years in current role</p>
          )}
        </div>
        
        <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-pink-600" />
            <span className="font-medium text-gray-900">Salary Expectations</span>
          </div>
          <p className="text-gray-700">£{profile.min_salary.toLocaleString()} - £{profile.max_salary.toLocaleString()} per year</p>
          
          {profile.commission_percentage && (
            <div className="mt-2">
              <p className="text-gray-700">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Open to "You're Hired" Bonus: {profile.commission_percentage}%
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;
