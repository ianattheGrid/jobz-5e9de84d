
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";

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
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" />
              Location & Work Details
            </h3>
            <div className="space-y-2">
              {profile.location?.length > 0 && (
                <p>Location: {profile.location.join(", ")}</p>
              )}
              {profile.preferred_work_type && (
                <p>Preferred Work Type: {profile.preferred_work_type}</p>
              )}
              {profile.work_eligibility && (
                <p>Work Eligibility: {profile.work_eligibility}</p>
              )}
              {profile.availability && (
                <p>Availability: {profile.availability}</p>
              )}
            </div>
          </div>

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
        </div>

        {(profile.required_qualifications?.length > 0 || profile.security_clearance) && (
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4" />
              Qualifications & Security
            </h3>
            {profile.required_qualifications && profile.required_qualifications.length > 0 && (
              <div className="mb-4">
                <p className="font-medium">Qualifications:</p>
                <ul className="list-disc list-inside">
                  {profile.required_qualifications.map((qual, index) => (
                    <li key={index}>{qual}</li>
                  ))}
                </ul>
              </div>
            )}
            {profile.security_clearance && (
              <p>Security Clearance: {profile.security_clearance}</p>
            )}
          </div>
        )}

        {profile.required_skills && profile.required_skills.length > 0 && (
          <div>
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
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
