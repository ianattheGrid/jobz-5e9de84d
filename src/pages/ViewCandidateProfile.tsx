import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, MapPin, GraduationCap, Shield, Clock } from "lucide-react";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";

export default function ViewCandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata.user_type !== 'employer') {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Only employers can view candidate profiles.",
        });
        navigate('/employer/signin');
        return;
      }
    };

    checkAuth();
  }, [navigate, toast]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          const validProfile = {
            ...data,
            location: data.location || [],
            required_qualifications: data.required_qualifications || null,
            required_skills: data.required_skills || null
          };
          setProfile(validProfile);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load candidate profile.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Search
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {profile?.job_title}
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
                <p>Location: {profile?.location?.join(", ") || "Not specified"}</p>
                <p>Preferred Work Type: {profile?.preferred_work_type || 'Not specified'}</p>
                <p>Work Eligibility: {profile?.work_eligibility || 'Not specified'}</p>
                <p>Availability: {profile?.availability || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4" />
                Experience & Skills
              </h3>
              <div className="space-y-2">
                <p>Years of Experience: {profile?.years_experience}</p>
                <p>Salary Expectation: £{profile?.min_salary.toLocaleString()} - £{profile?.max_salary.toLocaleString()}</p>
                {profile?.commission_percentage && (
                  <p>Desired "You're Hired" Bonus: {profile?.commission_percentage}%</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4" />
              Qualifications & Security
            </h3>
            {profile?.required_qualifications && profile?.required_qualifications.length > 0 && (
              <div className="mb-4">
                <p className="font-medium">Qualifications:</p>
                <ul className="list-disc list-inside">
                  {profile?.required_qualifications.map((qual, index) => (
                    <li key={index}>{qual}</li>
                  ))}
                </ul>
              </div>
            )}
            {profile?.security_clearance && (
              <p>Security Clearance: {profile?.security_clearance}</p>
            )}
          </div>

          {profile?.required_skills && profile?.required_skills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.required_skills.map((skill, index) => (
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

          {profile?.additional_skills && (
            <div>
              <h3 className="font-semibold mb-2">Additional Skills & Certifications</h3>
              <p>{profile?.additional_skills}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
