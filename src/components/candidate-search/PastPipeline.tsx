import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";

interface Person {
  id: string;
  full_name: string | null;
  job_title: string | null;
  desired_job_title: string | null;
  years_experience: number | null;
  required_skills: string[] | null;
  previous_role: string;
}

/**
 * People who already applied to this employer before and fit the role they're
 * now recruiting for — nobody new to find, just a reminder of who's already there.
 */
export function PastPipeline({ jobId }: { jobId: number }) {
  const { user } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!user) return;

      const { data: job } = await supabase
        .from("jobs")
        .select("work_area, specialization")
        .eq("id", jobId)
        .maybeSingle();
      if (!job) return;

      const { data: myJobs } = await supabase.from("jobs").select("id, title").eq("employer_id", user.id);
      const jobIds = (myJobs || []).map((j) => j.id).filter((id) => id !== jobId);
      if (!jobIds.length) return;

      const { data: apps } = await supabase
        .from("applications")
        .select("applicant_id, job_id")
        .in("job_id", jobIds)
        .neq("status", "hired");
      if (!apps?.length) return;

      const titleById = new Map((myJobs || []).map((j) => [j.id, j.title]));
      const uniqueIds = Array.from(new Set(apps.map((a) => a.applicant_id)));

      const { data: profiles } = await supabase
        .from("candidate_profiles")
        .select("id, full_name, job_title, desired_job_title, years_experience, required_skills, workArea, availability_status")
        .in("id", uniqueIds)
        .neq("availability_status", "not_looking");

      const fits = (profiles || []).filter(
        (p: any) => !job.work_area || !p.workArea || p.workArea === job.work_area,
      );

      setPeople(
        fits.slice(0, 6).map((p: any) => ({
          id: p.id,
          full_name: p.full_name,
          job_title: p.job_title,
          desired_job_title: p.desired_job_title,
          years_experience: p.years_experience,
          required_skills: p.required_skills,
          previous_role: titleById.get(apps.find((a) => a.applicant_id === p.id)!.job_id) || "a previous vacancy",
        })),
      );
    };

    run();
  }, [jobId, user]);

  if (people.length === 0) return null;

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-primary/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          {people.length} {people.length === 1 ? "person" : "people"} from your past applicants fit this role
        </CardTitle>
        <CardDescription className="text-white/70">
          They applied to you before and are still open to work.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {people.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
          >
            <div>
              <p className="text-white font-medium">{p.full_name || "Candidate"}</p>
              <p className="text-white/70 text-sm">
                {p.desired_job_title || p.job_title || "Role not stated"}
                {p.years_experience ? ` · ${p.years_experience} years` : ""}
              </p>
              <Badge variant="outline" className="mt-1 text-xs text-white/70 border-white/20">
                Applied for {p.previous_role}
              </Badge>
            </div>
            <Link to={`/employer/candidate/${p.id}`}>
              <Button size="sm" variant="secondary">
                View profile
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
