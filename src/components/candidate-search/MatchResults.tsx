import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Eye,
  MapPin,
  PoundSterling,
  Briefcase,
  Award,
  Check,
  AlertCircle,
  BookmarkPlus,
  BookmarkCheck,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useShortlist } from "@/hooks/useShortlist";
import { useSendRevealRequest } from "@/hooks/useRevealRequests";
import type { JobMatch } from "@/hooks/useJobMatches";

interface MatchResultsProps {
  matches: JobMatch[];
  jobId: number | null;
  jobTitle?: string | null;
  onRequested?: () => void;
}

const scoreTone = (score: number) => {
  if (score >= 75) return "bg-emerald-500/20 text-emerald-300 border-emerald-400/40";
  if (score >= 50) return "bg-amber-500/20 text-amber-300 border-amber-400/40";
  return "bg-white/10 text-white/70 border-white/20";
};

const activityFor = (match: JobMatch) => {
  const status = match.availability_status || "open_to_offers";
  const updated = match.updated_at ? new Date(match.updated_at) : null;
  const days = updated ? (Date.now() - updated.getTime()) / 86_400_000 : Infinity;

  if (status === "not_looking") return { dot: "bg-gray-400", label: "Not looking right now" };
  if (status === "actively_looking" && days <= 30) return { dot: "bg-green-500", label: "Actively looking" };
  if (days <= 60) return { dot: "bg-amber-500", label: "Open to the right offer" };
  return { dot: "bg-gray-400", label: "Quiet lately" };
};

const RevealButton = ({
  match,
  jobId,
  jobTitle,
  onRequested,
}: {
  match: JobMatch;
  jobId: number | null;
  jobTitle?: string | null;
  onRequested?: () => void;
}) => {
  const { send, sending } = useSendRevealRequest();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  if (match.reveal_status === "shared") {
    return (
      <Badge variant="outline" className="gap-1.5 border-emerald-400/40 bg-emerald-500/15 text-emerald-300">
        <ShieldCheck className="h-3.5 w-3.5" /> Details shared with you
      </Badge>
    );
  }

  if (match.reveal_status === "pending") {
    return (
      <Badge variant="outline" className="border-white/20 bg-white/5 text-white/70">
        Waiting for their answer
      </Badge>
    );
  }

  if (match.reveal_status === "declined") {
    return (
      <Badge variant="outline" className="border-white/20 bg-white/5 text-white/60">
        They declined this one
      </Badge>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Send className="h-4 w-4" /> Ask to see full profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ask to see this person's full profile</DialogTitle>
          <DialogDescription>
            They'll see your company name{jobTitle ? ` and the role "${jobTitle}"` : ""}, plus your
            note. Nothing personal is shared until they say yes.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="A short line about why you think they'd suit this role."
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={sending === match.candidate_id}
            onClick={async () => {
              const ok = await send(match.candidate_id, jobId, note);
              if (ok) {
                setOpen(false);
                setNote("");
                onRequested?.();
              }
            }}
          >
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function MatchResults({ matches, jobId, jobTitle, onRequested }: MatchResultsProps) {
  const navigate = useNavigate();
  const { savedIds, add: saveToShortlist } = useShortlist();

  if (matches.length === 0) {
    return (
      <p className="text-sm text-white/70">
        No one on Jobz matches this vacancy closely enough yet. As people join and update their
        profiles, matches will appear here automatically.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-white/70">
        {matches.length} {matches.length === 1 ? "person fits" : "people fit"} this role, best fit
        first. Names and contact details stay hidden until each person agrees.
      </p>

      <div className="grid gap-6">
        {matches.map((match) => {
          const activity = activityFor(match);
          const explanation = match.explanation;
          return (
            <Card
              key={match.candidate_id}
              className="bg-black/40 backdrop-blur-xl border-primary/30 hover:border-primary/60 transition-colors"
            >
              <CardHeader className="pb-4">
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div>
                    <CardTitle className="text-lg text-white">
                      {match.job_title || match.desired_job_title || "Candidate"}
                    </CardTitle>
                    <p className="text-white/60 text-sm">
                      Anonymous until they share their details
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={scoreTone(explanation.score)}>
                      {explanation.score}% match
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                      <span className={`inline-block h-2 w-2 rounded-full ${activity.dot}`} />
                      {activity.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {(explanation.reasons.length > 0 || explanation.gaps.length > 0) && (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-1">
                    <p className="text-sm font-medium text-white mb-1">Why they fit</p>
                    {explanation.reasons.map((reason, i) => (
                      <div key={`r-${i}`} className="flex items-start gap-2 text-sm text-white/80">
                        <Check className="h-4 w-4 mt-0.5 text-emerald-400 shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                    {explanation.gaps.map((gap, i) => (
                      <div key={`g-${i}`} className="flex items-start gap-2 text-sm text-white/70">
                        <AlertCircle className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                        <span>{gap}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Briefcase className="h-4 w-4" />
                    <span>{match.years_experience ?? 0} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {match.location?.length
                        ? match.location.join(", ")
                        : match.home_postcode || "Area not given"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <PoundSterling className="h-4 w-4" />
                    <span>
                      £{match.min_salary?.toLocaleString() ?? "?"} - £
                      {match.max_salary?.toLocaleString() ?? "?"}
                    </span>
                  </div>
                  {match.commission_percentage ? (
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Award className="h-4 w-4" />
                      <span>{match.commission_percentage}% "You're Hired" bonus</span>
                    </div>
                  ) : null}
                </div>

                {match.required_skills?.length ? (
                  <div>
                    <p className="text-sm font-medium text-white mb-2">Key skills</p>
                    <div className="flex flex-wrap gap-1">
                      {match.required_skills.slice(0, 6).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                {match.personal_statement && (
                  <p className="text-sm text-white/75 line-clamp-3">{match.personal_statement}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                  <Button
                    onClick={() => navigate(`/employer/candidate/${match.candidate_id}`)}
                    className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View profile
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    disabled={savedIds.has(match.candidate_id)}
                    onClick={() => saveToShortlist(match.candidate_id, jobId)}
                  >
                    {savedIds.has(match.candidate_id) ? (
                      <>
                        <BookmarkCheck className="h-4 w-4" /> On your shortlist
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="h-4 w-4" /> Save to shortlist
                      </>
                    )}
                  </Button>
                  <RevealButton
                    match={match}
                    jobId={jobId}
                    jobTitle={jobTitle}
                    onRequested={onRequested}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
