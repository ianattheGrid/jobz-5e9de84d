
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, DollarSign, Calendar, Briefcase, Award, Check, AlertCircle, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { MatchExplanation } from "./searchCriteria";
import { useShortlist } from "@/hooks/useShortlist";

interface SearchResultsProps {
  candidates: CandidateProfile[];
  explanations?: Record<string, MatchExplanation>;
  /** When the search came from a vacancy, remember which one on the shortlist entry. */
  jobId?: number | null;
}

const scoreTone = (score: number) => {
  if (score >= 75) return "bg-emerald-500/20 text-emerald-300 border-emerald-400/40";
  if (score >= 50) return "bg-amber-500/20 text-amber-300 border-amber-400/40";
  return "bg-white/10 text-white/70 border-white/20";
};

/**
 * How worth contacting this person is right now: what they've said about
 * looking, plus how recently they touched their profile.
 */
const activityFor = (candidate: any) => {
  const status = candidate.availability_status || "open_to_offers";
  const updated = candidate.updated_at ? new Date(candidate.updated_at) : null;
  const days = updated ? (Date.now() - updated.getTime()) / 86_400_000 : Infinity;

  if (status === "not_looking") {
    return { dot: "bg-gray-400", label: "Not looking right now" };
  }
  if (status === "actively_looking" && days <= 30) {
    return { dot: "bg-green-500", label: "Actively looking" };
  }
  if (days <= 60) {
    return { dot: "bg-amber-500", label: "Open to the right offer" };
  }
  return { dot: "bg-gray-400", label: "Quiet lately" };
};

export function SearchResults({ candidates, explanations = {}, jobId = null }: SearchResultsProps) {
  const navigate = useNavigate();
  const { savedIds, add: saveToShortlist } = useShortlist();


  if (candidates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70 text-lg">No candidates found matching your criteria.</p>
        <p className="text-white/50 text-sm mt-2">
          Try adjusting your search filters to find more candidates.
        </p>
      </div>
    );
  }

  const handleViewProfile = (candidateId: string) => {
    navigate(`/employer/candidate/${candidateId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/70">
          Showing {candidates.length} candidate{candidates.length === 1 ? '' : 's'}
        </p>
      </div>
      
      <div className="grid gap-6">
        {candidates.map((candidate) => {
          const explanation = explanations[candidate.id];
          const activity = activityFor(candidate);
          return (
          <Card key={candidate.id} className="bg-black/40 backdrop-blur-xl border-primary/30 hover:border-primary/60 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-white">
                    {candidate.full_name || 'Candidate Profile'}
                  </CardTitle>
                  <p className="text-white/70 font-medium">
                    {Array.isArray(candidate.job_title) 
                      ? candidate.job_title.join(' / ') 
                      : candidate.job_title}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {explanation && (
                    <Badge variant="outline" className={scoreTone(explanation.score)}>
                      {explanation.score}% match
                    </Badge>
                  )}
                  <Badge variant="secondary" className="gap-1.5">
                    <span className={`inline-block h-2 w-2 rounded-full ${activity.dot}`} />
                    {activity.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {explanation && (explanation.reasons.length > 0 || explanation.gaps.length > 0) && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-1">
                  <p className="text-sm font-medium text-white mb-1">Why this candidate</p>
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
                  <span>{candidate.years_experience} years experience</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <MapPin className="h-4 w-4" />
                  <span>{Array.isArray(candidate.location) ? candidate.location.join(", ") : candidate.location || 'Location not specified'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <DollarSign className="h-4 w-4" />
                  <span>£{candidate.min_salary?.toLocaleString()} - £{candidate.max_salary?.toLocaleString()}</span>
                </div>
                
                {candidate.signup_date && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(candidate.signup_date).toLocaleDateString()}</span>
                  </div>
                )}
                
                {candidate.commission_percentage && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Award className="h-4 w-4" />
                    <span>{candidate.commission_percentage}% "You're Hired" bonus</span>
                  </div>
                )}
                
                {candidate.work_eligibility && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <span>Work eligibility: {candidate.work_eligibility}</span>
                  </div>
                )}
              </div>

              {candidate.required_skills && candidate.required_skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-white mb-2">Key Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.required_skills.slice(0, 6).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.required_skills.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{candidate.required_skills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {candidate.required_qualifications && candidate.required_qualifications.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-white mb-2">Qualifications:</p>
                  <p className="text-sm text-white/70">{candidate.required_qualifications.join(', ')}</p>
                </div>
              )}

              {candidate.security_clearance && (
                <div>
                  <p className="text-sm font-medium text-white mb-1">Security Clearance:</p>
                  <Badge variant="secondary">{candidate.security_clearance}</Badge>
                </div>
              )}

              {candidate.ai_synopsis && (
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-sm font-medium text-white mb-1">AI Profile Summary:</p>
                  <p className="text-sm text-white/80 line-clamp-2">{candidate.ai_synopsis}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button 
                  onClick={() => handleViewProfile(candidate.id)}
                  className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Full Profile
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={savedIds.has(candidate.id)}
                  onClick={() => saveToShortlist(candidate.id, jobId)}
                >
                  {savedIds.has(candidate.id) ? (
                    <>
                      <BookmarkCheck className="h-4 w-4" /> On your shortlist
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="h-4 w-4" /> Save to shortlist
                    </>
                  )}
                </Button>

              </div>
            </CardContent>
          </Card>
          );
        })}

      </div>
    </div>
  );
}
