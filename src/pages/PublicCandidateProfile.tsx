import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { Footer } from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { ArrowRight, Briefcase, MapPin, PoundSterling } from "lucide-react";

interface PublicProfile {
  full_name: string | null;
  job_title: string | null;
  desired_job_title: string | null;
  years_experience: number | null;
  min_salary: number | null;
  max_salary: number | null;
  location: string[] | null;
  required_skills: string[] | null;
  additional_skills: string | null;
  work_area: string | null;
  specialization: string | null;
  personal_statement: string | null;
  availability_status: string | null;
}

const AVAILABILITY_LABEL: Record<string, string> = {
  actively_looking: "Actively looking",
  open_to_offers: "Open to the right offer",
  not_looking: "Not looking right now",
};

export default function PublicCandidateProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const { data, error } = await supabase.rpc("get_public_candidate_profile", {
        _slug: slug,
      });

      if (!error && data && data.length > 0) {
        setProfile(data[0] as unknown as PublicProfile);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const skills = [
    ...(profile?.required_skills || []),
    ...(profile?.additional_skills
      ? String(profile.additional_skills)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []),
  ].slice(0, 20);

  return (
    <CosmicBackground mode="full">
      <NavBar />
      <main className="container mx-auto px-4 py-16 pt-24 max-w-3xl">
        {loading ? (
          <p className="text-white/70">Loading…</p>
        ) : !profile ? (
          <Card className="bg-black/40 backdrop-blur-xl border-primary/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl">This page isn't available</CardTitle>
              <CardDescription className="text-white/70">
                The link may be wrong, or the person has switched their page off.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="gap-2">
                <Link to="/jobs">
                  Browse jobs instead <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-primary/30">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle className="text-white text-3xl">
                    {profile.full_name || "Candidate"}
                  </CardTitle>
                  {profile.availability_status && (
                    <Badge variant="secondary">
                      {AVAILABILITY_LABEL[profile.availability_status] || "Open to offers"}
                    </Badge>
                  )}
                </div>
                {(profile.desired_job_title || profile.job_title) &&
                  (profile.desired_job_title || profile.job_title) !== "Not specified" && (
                    <CardDescription className="text-white/80 text-lg pt-1">
                      {profile.desired_job_title || profile.job_title}
                    </CardDescription>
                  )}
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-4 text-white/80 text-sm">
                {profile.years_experience ? (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    {profile.years_experience} years' experience
                  </div>
                ) : null}
                {profile.location?.length ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {profile.location.join(", ")}
                  </div>
                ) : null}
                {profile.min_salary && profile.max_salary ? (
                  <div className="flex items-center gap-2">
                    <PoundSterling className="h-4 w-4 text-primary" />
                    {profile.min_salary.toLocaleString()} – {profile.max_salary.toLocaleString()}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {profile.personal_statement && (
              <Card className="bg-black/40 backdrop-blur-xl border-primary/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">About me</CardTitle>
                </CardHeader>
                <CardContent className="text-white/80 whitespace-pre-line">
                  {profile.personal_statement}
                </CardContent>
              </Card>
            )}

            {skills.length > 0 && (
              <Card className="bg-black/40 backdrop-blur-xl border-primary/30">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Skills</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="bg-primary/10 backdrop-blur-xl border-primary/40">
              <CardHeader>
                <CardTitle className="text-white text-xl">Hiring? Talk to them directly</CardTitle>
                <CardDescription className="text-white/70">
                  No agency, no commission. Create a free employer account to get in touch, or make
                  your own page if you're looking for work.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button asChild className="gap-2">
                  <Link to="/employer/signup">
                    I'm hiring <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/cv-review">Get my free CV review</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </CosmicBackground>
  );
}
