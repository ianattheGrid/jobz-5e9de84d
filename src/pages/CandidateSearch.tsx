import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEmployerAuthCheck } from "@/hooks/useEmployerAuthCheck";
import { useJobMatches } from "@/hooks/useJobMatches";
import { MatchResults } from "@/components/candidate-search/MatchResults";
import { LoadingState } from "@/components/candidate-search/LoadingState";
import { PastPipeline } from "@/components/candidate-search/PastPipeline";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, Sparkles } from "lucide-react";
import NavBar from "@/components/NavBar";

/**
 * Match-led candidate discovery. There is no browsable candidate database on
 * Jobz: people only ever appear against one of the employer's own vacancies.
 */
export default function CandidateSearch() {
  const { loading, checkUser } = useEmployerAuthCheck();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("jobId") ? Number(searchParams.get("jobId")) : null;

  const { matches, job, loading: matching, notVerified, reload } = useJobMatches(jobId);
  const [myJobs, setMyJobs] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  useEffect(() => {
    if (jobId) return;
    const loadJobs = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data } = await supabase
        .from("jobs")
        .select("id, title, location, created_at")
        .eq("employer_id", auth.user.id)
        .order("created_at", { ascending: false });
      setMyJobs(data || []);
    };
    loadJobs();
  }, [jobId]);

  if (loading) return <LoadingState />;

  return (
    <CosmicBackground mode="full">
      <NavBar />
      <div className="container max-w-5xl mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Find people for a role</h1>
          <p className="text-white/70 mt-2 max-w-2xl">
            Jobz doesn't have a candidate database to scroll through. Pick one of your vacancies and
            we'll show the people who fit it, best first, with the reasons why. Names and contact
            details only appear when the person agrees to share them.
          </p>
        </div>

        {notVerified && (
          <Card className="bg-black/40 backdrop-blur-xl border-amber-400/40 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-lg">We're still checking your company</CardTitle>
            </CardHeader>
            <CardContent className="text-white/75 text-sm">
              Match results are only shown to verified companies. We check this automatically from
              your company details and work email — it usually happens within a day. You can carry
              on posting vacancies in the meantime.
            </CardContent>
          </Card>
        )}

        {!jobId && (
          <Card className="bg-black/40 backdrop-blur-xl border-primary/30">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Choose a vacancy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {myJobs.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-white/70 text-sm">
                    You haven't posted a vacancy yet. Post one and we'll start matching people to it
                    straight away.
                  </p>
                  <Button onClick={() => navigate("/employer/create-vacancy")}>
                    Post a vacancy
                  </Button>
                </div>
              ) : (
                myJobs.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => navigate(`/employer/candidate-search?jobId=${j.id}`)}
                    className="w-full text-left rounded-lg border border-white/10 bg-white/5 hover:border-primary/50 transition-colors p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-white font-medium">{j.title}</p>
                      <p className="text-white/60 text-sm">{j.location}</p>
                    </div>
                    <span className="text-primary flex items-center gap-2 text-sm shrink-0">
                      <Search className="h-4 w-4" /> Find people
                    </span>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {jobId && (
          <div className="flex flex-col gap-8">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-white/80">
                People who fit your vacancy <strong>{job?.title || "this role"}</strong>.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/employer/candidate-search")}
              >
                Choose a different vacancy
              </Button>
            </div>

            <PastPipeline jobId={jobId} />

            <div className="rounded-lg p-6 bg-black/30 backdrop-blur-xl border border-primary/20">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Your matches</h2>
                <p className="text-sm text-white/70 mt-1">
                  Ranked by how well each person fits, with the reasoning shown.
                </p>
              </div>
              {matching ? (
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Finding people who fit…
                </div>
              ) : (
                <MatchResults
                  matches={matches}
                  jobId={jobId}
                  jobTitle={job?.title}
                  onRequested={reload}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </CosmicBackground>
  );
}
