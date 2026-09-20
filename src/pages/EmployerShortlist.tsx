import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useShortlist } from "@/hooks/useShortlist";
import { useEmployerAuthCheck } from "@/hooks/useEmployerAuthCheck";
import { Trash2, Eye, Search } from "lucide-react";

export default function EmployerShortlist() {
  const { checkUser } = useEmployerAuthCheck();
  const { entries, loading, remove, updateEntry } = useShortlist();
  const [drafts, setDrafts] = useState<Record<string, { note: string; tags: string }>>({});

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  useEffect(() => {
    document.title = "Your shortlist | Jobz";
  }, []);

  const draftFor = (id: string, note: string | null, tags: string[]) =>
    drafts[id] ?? { note: note ?? "", tags: tags.join(", ") };

  return (
    <CosmicBackground mode="full">
      <NavBar />
      <div className="container max-w-4xl mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Your shortlist</h1>
            <p className="text-white/70 mt-2">
              People you've saved, with your own notes and tags. Only you can see this.
            </p>
          </div>
          <Link to="/employer/candidate-search">
            <Button className="gap-2">
              <Search className="h-4 w-4" /> Find more people
            </Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-white/70">Loading your shortlist...</p>
        ) : entries.length === 0 ? (
          <Card className="bg-black/40 backdrop-blur-xl border-primary/30">
            <CardContent className="py-10 text-center">
              <p className="text-white/80">You haven't saved anyone yet.</p>
              <p className="text-white/60 text-sm mt-2">
                Use "Save to shortlist" on a search result and they'll appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => {
              const d = draftFor(entry.id, entry.note, entry.tags);
              return (
                <Card key={entry.id} className="bg-black/40 backdrop-blur-xl border-primary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-white text-lg">
                          {entry.candidate?.full_name || "Candidate"}
                        </CardTitle>
                        <p className="text-white/70 text-sm">
                          {entry.candidate?.desired_job_title || entry.candidate?.job_title || "Role not stated"}
                          {entry.candidate?.years_experience
                            ? ` · ${entry.candidate.years_experience} years`
                            : ""}
                          {entry.candidate?.location?.length ? ` · ${entry.candidate.location.join(", ")}` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/employer/candidate/${entry.candidate_id}`}>
                          <Button size="sm" variant="secondary" className="gap-1">
                            <Eye className="h-4 w-4" /> View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white/60 hover:text-white"
                          onClick={() => remove(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {entry.candidate?.required_skills?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {entry.candidate.required_skills.slice(0, 8).map((s) => (
                          <Badge key={s} variant="outline" className="text-xs text-white/80 border-white/20">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="text-sm text-white/70">Your tags (comma separated)</label>
                        <Input
                          value={d.tags}
                          onChange={(e) =>
                            setDrafts((p) => ({ ...p, [entry.id]: { ...d, tags: e.target.value } }))
                          }
                          placeholder="e.g. strong, interview next"
                          className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/70">Private note</label>
                        <Textarea
                          rows={2}
                          value={d.note}
                          onChange={(e) =>
                            setDrafts((p) => ({ ...p, [entry.id]: { ...d, note: e.target.value } }))
                          }
                          placeholder="Anything you want to remember about them"
                          className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        />
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() =>
                        updateEntry(entry.id, {
                          note: d.note,
                          tags: d.tags
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                    >
                      Save note
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </CosmicBackground>
  );
}
