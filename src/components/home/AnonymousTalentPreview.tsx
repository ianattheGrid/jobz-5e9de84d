import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, PoundSterling, Briefcase } from "lucide-react";

interface PreviewCard {
  token: string;
  job_title: string | null;
  area: string | null;
  min_salary: number | null;
  max_salary: number | null;
  years_experience: number | null;
  top_skills: string[] | null;
  availability_status: string | null;
}

const dotFor = (status: string | null) =>
  status === "actively_looking"
    ? "bg-green-500"
    : status === "not_looking"
    ? "bg-gray-400"
    : "bg-amber-500";

/**
 * Proof there are real people here, with nothing that identifies anyone: no
 * name, photo, employer or contact details. Only people who opted in appear.
 */
export const AnonymousTalentPreview = () => {
  const [cards, setCards] = useState<PreviewCard[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.rpc("get_public_preview_cards", { _limit: 6 });
      setCards((data || []) as any);
    };
    load();
  }, []);

  if (cards.length === 0) return null;

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">People looking right now</h2>
          <p className="text-white/70 mt-3 max-w-2xl mx-auto">
            Real people on Jobz, shown anonymously. No names, no photos, no contact details — they
            only appear against a real vacancy, and only they can release their details.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.token}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-white font-semibold">{c.job_title}</p>
                <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${dotFor(c.availability_status)}`} />
              </div>
              <div className="space-y-1.5 text-sm text-white/70">
                <p className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> {c.years_experience ?? 0} years experience
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {c.area}
                </p>
                {(c.min_salary || c.max_salary) && (
                  <p className="flex items-center gap-2">
                    <PoundSterling className="h-4 w-4" />
                    £{c.min_salary?.toLocaleString() ?? "?"} - £{c.max_salary?.toLocaleString() ?? "?"}
                  </p>
                )}
              </div>
              {c.top_skills?.length ? (
                <div className="flex flex-wrap gap-1 pt-1">
                  {c.top_skills.map((s, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild size="lg">
            <Link to="/employer/create-vacancy">Post a vacancy and see who fits</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
