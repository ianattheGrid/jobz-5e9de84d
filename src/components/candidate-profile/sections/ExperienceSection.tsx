
import { GraduationCap, Banknote } from "lucide-react";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface ExperienceSectionProps {
  profile: CandidateProfile;
}

const ExperienceSection = ({ profile }: ExperienceSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-pink-600" />
            <span className="font-medium text-gray-900">Professional Experience</span>
          </div>
          <p className="text-gray-700">{profile.years_in_current_title || profile.years_experience} years in {(() => {
            // Handle job_title which might be a string, an array, or a JSON string
            if (!profile.job_title) return profile.workArea || "current field";
            
            try {
              // If it's a JSON string, parse it
              if (typeof profile.job_title === 'string' && profile.job_title.startsWith('[')) {
                const titles = JSON.parse(profile.job_title);
                return Array.isArray(titles) ? titles[0] : profile.job_title;
              }
              // If it's already an array
              else if (Array.isArray(profile.job_title)) {
                return profile.job_title[0];
              }
              // If it's just a string
              return profile.job_title;
            } catch (e) {
              // If JSON parsing fails, return as is
              return profile.job_title;
            }
          })() || profile.workArea || "current field"}</p>
          
          {profile.itSpecialization && (
            <p className="text-gray-700">Specialization: {profile.itSpecialization}</p>
          )}
          
          {profile.years_in_current_title !== null && profile.years_in_current_title !== undefined && (
            <p className="text-gray-700">{profile.years_in_current_title} years in current role</p>
          )}
        </div>
        
        <div className="space-y-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
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
