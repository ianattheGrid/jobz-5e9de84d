
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, LinkedinIcon } from "lucide-react";
import type { CandidateProfile } from "@/integrations/supabase/types/profiles";
import LocationSection from "./sections/LocationSection";
import ExperienceSection from "./sections/ExperienceSection";
import QualificationsSection from "./sections/QualificationsSection";
import SkillsSection from "./sections/SkillsSection";
import JobTitlesSection from "./sections/JobTitlesSection";
import GalleryCarousel from "./sections/GalleryCarousel";
import { supabase } from "@/integrations/supabase/client";

interface ProfileDetailsProps {
  profile: CandidateProfile;
  showVRRecommendation?: boolean;
  vrRecommendation?: any;
}

const ProfileDetails = ({ profile, showVRRecommendation = false, vrRecommendation = null }: ProfileDetailsProps) => {
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
      <Card className="border-none shadow-md overflow-hidden bg-white">
        <div className="h-24 bg-gradient-to-r from-indigo-900 via-pink-600 to-pink-400"></div>
        <CardContent className="pt-0 relative pb-6 bg-white">
          <div className="flex flex-col sm:flex-row -mt-12 sm:-mt-12 items-start sm:items-end gap-4">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-lg mt-4">
              <AvatarImage src={profile.profile_picture_url || undefined} alt={profile.full_name || "Profile"} />
              <AvatarFallback className="text-2xl bg-pink-100 text-pink-800">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="pt-2 sm:pb-4 flex-1 mt-4">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{profile.full_name || "Anonymous Candidate"}</h1>
                {showVRRecommendation && vrRecommendation && (
                  <Badge variant="secondary" className="bg-pink-100 text-pink-800 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <polyline points="16 11 18 13 22 9"></polyline>
                    </svg>
                    VR Recommended
                  </Badge>
                )}
              </div>
              <h2 className="text-xl text-gray-700">
                {(() => {
                  // Handle job_title which might be a string, an array, or a JSON string
                  if (!profile.job_title) return "Job Title Not Specified";
                  
                  try {
                    // If it's a JSON string, parse it
                    if (typeof profile.job_title === 'string' && profile.job_title.startsWith('[')) {
                      const titles = JSON.parse(profile.job_title);
                      return Array.isArray(titles) ? titles.join(", ") : profile.job_title;
                    }
                    // If it's already an array
                    else if (Array.isArray(profile.job_title)) {
                      return profile.job_title.join(", ");
                    }
                    // If it's just a string
                    return profile.job_title;
                  } catch (e) {
                    // If JSON parsing fails, return as is
                    return profile.job_title;
                  }
                })()}
              </h2>
              <div className="flex items-center text-gray-600 gap-2 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{profile.location?.join(", ") || "Location not specified"}</span>
              </div>
              {((profile as any).visible_sections?.linkedin ?? true) && profile.linkedin_url && (
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
      {((profile as any).visible_sections?.about ?? true) && profile.ai_synopsis && (
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">About</h3>
            <p className="text-gray-700">{profile.ai_synopsis}</p>
          </CardContent>
        </Card>
      )}


      {/* Experience */}
      {((profile as any).visible_sections?.experience ?? true) && (
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-5 w-5 text-pink-600" />
              <h3 className="text-xl font-semibold text-gray-900">Experience</h3>
            </div>
            
            <div className="space-y-6">
              {profile.current_employer && (
                <div className="border-l-2 border-pink-200 pl-4 py-1">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-pink-50 flex items-center justify-center rounded">
                      <Briefcase className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{(() => {
                        // Handle job_title which might be a string, an array, or a JSON string
                        if (!profile.job_title) return "No Job Title";
                        
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
                      })()}</h4>
                      <p className="text-gray-700">{profile.current_employer}</p>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>
                          {profile.years_in_current_title !== null && profile.years_in_current_title !== undefined 
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
                <JobTitlesSection profile={profile} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills and Qualifications */}
      {(((profile as any).visible_sections?.skills ?? true) || ((profile as any).visible_sections?.qualifications ?? true)) && (
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardContent className="pt-6">
            {((profile as any).visible_sections?.skills ?? true) && <SkillsSection profile={profile} />}
            
            {((profile as any).visible_sections?.qualifications ?? true) && (
              <div className="mt-6">
                <QualificationsSection profile={profile} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Location and Preferences */}
      <Card className="shadow-sm border border-gray-200 bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-pink-600" />
            <h3 className="text-xl font-semibold text-gray-900">Location & Preferences</h3>
          </div>
          
          <LocationSection profile={profile} />
          
          {profile.cv_url && (
            <div className="mt-6">
              <button 
                type="button"
                onClick={async () => {
                  try {
                    let path = profile.cv_url as string;
                    if (path.startsWith('http')) {
                      const parts = path.split('/');
                      const idx = parts.findIndex(p => p === 'cvs');
                      if (idx !== -1) {
                        path = parts.slice(idx + 1).join('/');
                      }
                    }
                    const { data, error } = await supabase.storage
                      .from('cvs')
                      .createSignedUrl(path, 3600);
                    if (error) throw error;
                    if (data?.signedUrl) {
                      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
                    }
                  } catch (e) {
                    console.error('Failed to open CV', e);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-colors"
                aria-label="View CV"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <line x1="10" y1="9" x2="8" y2="9"></line>
                </svg>
                <span>View CV</span>
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom section with Gallery above Personality, both full width */}
      <div className="space-y-6">
        {/* Gallery */}
        {((profile as any).visible_sections?.gallery ?? true) && (
          <GalleryCarousel candidateId={(profile as any).id as unknown as string} />
        )}

        {/* Personality Snapshots */}
        {((profile as any).visible_sections?.personality ?? true) && Array.isArray((profile as any).personality) && (profile as any).personality.length > 0 && (
          <Card className="shadow-sm border border-gray-200 bg-white">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Personality</h3>
              <div className="grid gap-3">
                {(profile as any).personality.map((item: any) => (
                  <div key={item.question_key} className="rounded-md border border-pink-200 bg-pink-50 p-4">
                    <div className="text-xs font-medium text-pink-700">{item.question_label}</div>
                    <div className="mt-1 text-gray-800">{item.answer}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
