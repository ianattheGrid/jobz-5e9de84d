
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, User, GraduationCap, Calendar, LinkedinIcon } from "lucide-react";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";
import LocationSection from "./sections/LocationSection";
import ExperienceSection from "./sections/ExperienceSection";
import QualificationsSection from "./sections/QualificationsSection";
import SkillsSection from "./sections/SkillsSection";

interface ProfileDetailsProps {
  profile: CandidateProfile;
}

const ProfileDetails = ({ profile }: ProfileDetailsProps) => {
  // Get initials for the avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-none shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
        <CardContent className="pt-0 relative pb-6">
          <div className="flex flex-col sm:flex-row -mt-12 sm:-mt-16 items-start sm:items-end gap-4">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-lg">
              <AvatarImage src={profile.profile_picture_url || undefined} alt={profile.full_name || "Profile"} />
              <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="pt-2 sm:pb-4 flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.full_name || "Anonymous Candidate"}</h1>
              <h2 className="text-xl text-gray-700">{profile.job_title || "Job Title Not Specified"}</h2>
              <div className="flex items-center text-gray-600 gap-2 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{profile.location?.join(", ") || "Location not specified"}</span>
              </div>
              {profile.linkedin_url && (
                <a 
                  href={profile.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-2"
                >
                  <LinkedinIcon className="h-4 w-4" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About/Summary */}
      {profile.ai_synopsis && (
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">About</h3>
            <p className="text-gray-700">{profile.ai_synopsis}</p>
          </CardContent>
        </Card>
      )}

      {/* Experience */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Experience</h3>
          </div>
          
          <div className="space-y-6">
            {profile.current_employer && (
              <div className="border-l-2 border-gray-200 pl-4 py-1">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded">
                    <Briefcase className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{profile.job_title || "No Job Title"}</h4>
                    <p className="text-gray-700">{profile.current_employer}</p>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {profile.years_in_current_title 
                          ? `${profile.years_in_current_title} year${profile.years_in_current_title !== 1 ? 's' : ''} in current role` 
                          : `${profile.years_experience} year${profile.years_experience !== 1 ? 's' : ''} of experience`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <ExperienceSection profile={profile} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills and Qualifications */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="pt-6">
          <SkillsSection profile={profile} />
          
          <div className="mt-6">
            <QualificationsSection profile={profile} />
          </div>
        </CardContent>
      </Card>

      {/* Location and Preferences */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Location & Preferences</h3>
          </div>
          
          <LocationSection profile={profile} />
          
          {profile.cv_url && (
            <div className="mt-6">
              <a 
                href={profile.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <line x1="10" y1="9" x2="8" y2="9"></line>
                </svg>
                View CV
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDetails;
