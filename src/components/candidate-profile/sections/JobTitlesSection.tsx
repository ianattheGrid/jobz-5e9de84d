
import { Briefcase } from "lucide-react";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface JobTitlesSectionProps {
  profile: CandidateProfile;
}

const JobTitlesSection = ({ profile }: JobTitlesSectionProps) => {
  // Parse the job titles and experience
  const getJobTitles = () => {
    if (!profile.job_title) return [];
    
    try {
      // If it's a JSON string, parse it
      if (typeof profile.job_title === 'string' && profile.job_title.startsWith('[')) {
        return JSON.parse(profile.job_title);
      }
      // If it's already an array
      else if (Array.isArray(profile.job_title)) {
        return profile.job_title;
      }
      // If it's just a string
      return [profile.job_title];
    } catch (e) {
      // If JSON parsing fails, return as single item array
      return [profile.job_title];
    }
  };

  // Get experience data from title_experience if available
  const getTitleExperience = (title: string) => {
    if (!profile.title_experience) return null;
    
    try {
      const experienceData = typeof profile.title_experience === 'string' 
        ? JSON.parse(profile.title_experience) 
        : profile.title_experience;
      
      return experienceData[title] || null;
    } catch (e) {
      return null;
    }
  };

  const jobTitles = getJobTitles();

  if (jobTitles.length <= 1) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className="h-4 w-4 text-pink-600" />
        <h3 className="font-medium text-gray-900">Job Titles</h3>
      </div>

      <div className="space-y-3">
         {jobTitles.map((title, index) => (
           <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md job-title-item">
             <div className="font-medium text-gray-600">{title}</div>
             <div className="text-sm text-gray-600">
               {getTitleExperience(title) 
                 ? `${getTitleExperience(title)} years experience`
                 : ''
               }
             </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default JobTitlesSection;
