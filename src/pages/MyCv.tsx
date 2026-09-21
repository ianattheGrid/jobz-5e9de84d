import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CvProfile {
  full_name: string | null;
  email: string;
  phone_number: string | null;
  location: string[] | null;
  job_title: string;
  desired_job_title: string | null;
  years_experience: number;
  current_employer: string | null;
  personal_statement: string | null;
  required_skills: string[] | null;
  additional_skills: string | null;
  required_qualifications: string[] | null;
  linkedin_url: string | null;
  public_profile_slug: string | null;
  public_profile_enabled: boolean;
}

const MyCv = () => {
  const [profile, setProfile] = useState<CvProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "My CV | Jobz";
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        setError("Please sign in to see your CV.");
        setLoading(false);
        return;
      }
      const { data, error: loadError } = await supabase
        .from("candidate_profiles")
        .select(
          "full_name, email, phone_number, location, job_title, desired_job_title, years_experience, current_employer, personal_statement, required_skills, additional_skills, required_qualifications, linkedin_url, public_profile_slug, public_profile_enabled"
        )
        .eq("id", auth.user.id)
        .maybeSingle();

      if (loadError || !data) {
        setError("We could not load your profile. Please fill it in first.");
      } else {
        setProfile(data as CvProfile);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading your CV…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <p className="mb-4 text-foreground">{error}</p>
          <Link to="/candidate/profile" className="text-primary hover:underline">
            Go to my profile
          </Link>
        </div>
      </div>
    );
  }

  const skills = [
    ...(profile.required_skills || []),
    ...(profile.additional_skills
      ? profile.additional_skills.split(",").map((s) => s.trim()).filter(Boolean)
      : []),
  ];

  const profileLink = profile.public_profile_enabled && profile.public_profile_slug
    ? `jobz.dgrid.co/p/${profile.public_profile_slug}`
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Controls — hidden when printing */}
      <div className="print:hidden border-b border-border">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My CV</h1>
            <p className="text-sm text-muted-foreground">
              A plain CV that machines read properly. Press download, then choose
              "Save as PDF".
            </p>
          </div>
          <Button onClick={() => window.print()} className="gap-2">
            <Download className="h-4 w-4" /> Download my CV
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="cv-sheet mx-auto max-w-3xl rounded-2xl bg-white p-10 text-black shadow-elevated print:rounded-none print:p-0 print:shadow-none">
          <header className="border-b border-gray-300 pb-4">
            <h2 className="text-3xl font-bold">{profile.full_name || "Your name"}</h2>
            <p className="mt-1 text-lg">
              {profile.desired_job_title || profile.job_title}
            </p>
            <p className="mt-2 text-sm">
              {[
                profile.email,
                profile.phone_number,
                profile.location?.join(", "),
                profile.linkedin_url,
              ]
                .filter(Boolean)
                .join("  ·  ")}
            </p>
          </header>

          {profile.personal_statement && (
            <section className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wide">Profile</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">
                {profile.personal_statement}
              </p>
            </section>
          )}

          <section className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wide">Experience</h3>
            <p className="mt-2 text-sm leading-relaxed">
              {profile.years_experience} years' experience as {profile.job_title}
              {profile.current_employer ? `, currently at ${profile.current_employer}` : ""}.
            </p>
          </section>

          {skills.length > 0 && (
            <section className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wide">Skills</h3>
              <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed">
                {skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </section>
          )}

          {profile.required_qualifications && profile.required_qualifications.length > 0 && (
            <section className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wide">Qualifications</h3>
              <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed">
                {profile.required_qualifications.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </section>
          )}

          <footer className="mt-8 border-t border-gray-300 pt-3 text-xs text-gray-600">
            {profileLink ? `Profile: ${profileLink}` : "Profile: jobz.dgrid.co"}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default MyCv;
