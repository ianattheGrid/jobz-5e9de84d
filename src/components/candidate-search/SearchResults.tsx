
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, DollarSign, Calendar, Briefcase, Award, Check, AlertCircle } from "lucide-react";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { MatchExplanation } from "./searchCriteria";

interface SearchResultsProps {
  candidates: CandidateProfile[];
  explanations?: Record<string, MatchExplanation>;
}

const scoreTone = (score: number) => {
  if (score >= 75) return "bg-green-100 text-green-800 border-green-200";
  if (score >= 50) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

export function SearchResults({ candidates, explanations = {} }: SearchResultsProps) {
  const navigate = useNavigate();


  if (candidates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No candidates found matching your criteria.</p>
        <p className="text-gray-400 text-sm mt-2">
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
        <p className="text-sm text-gray-600">
          Showing {candidates.length} candidate{candidates.length === 1 ? '' : 's'}
        </p>
      </div>
      
      <div className="grid gap-6">
        {candidates.map((candidate) => {
          const explanation = explanations[candidate.id];
          return (
          <Card key={candidate.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    {candidate.full_name || 'Candidate Profile'}
                  </CardTitle>
                  <p className="text-gray-600 font-medium">
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
                  <Badge variant="secondary">
                    {candidate.availability || 'Available'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {explanation && (explanation.reasons.length > 0 || explanation.gaps.length > 0) && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">Why this candidate</p>
                  {explanation.reasons.map((reason, i) => (
                    <div key={`r-${i}`} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                  {explanation.gaps.map((gap, i) => (
                    <div key={`g-${i}`} className="flex items-start gap-2 text-sm text-gray-600">
                      <AlertCircle className="h-4 w-4 mt-0.5 text-amber-600 shrink-0" />
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  <span>{candidate.years_experience} years experience</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{Array.isArray(candidate.location) ? candidate.location.join(", ") : candidate.location || 'Location not specified'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span>£{candidate.min_salary?.toLocaleString()} - £{candidate.max_salary?.toLocaleString()}</span>
                </div>
                
                {candidate.signup_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(candidate.signup_date).toLocaleDateString()}</span>
                  </div>
                )}
                
                {candidate.commission_percentage && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>{candidate.commission_percentage}% "You're Hired" bonus</span>
                  </div>
                )}
                
                {candidate.work_eligibility && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Work eligibility: {candidate.work_eligibility}</span>
                  </div>
                )}
              </div>

              {candidate.required_skills && candidate.required_skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Key Skills:</p>
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
                  <p className="text-sm font-medium text-gray-900 mb-2">Qualifications:</p>
                  <p className="text-sm text-gray-600">{candidate.required_qualifications.join(', ')}</p>
                </div>
              )}

              {candidate.security_clearance && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Security Clearance:</p>
                  <Badge variant="secondary">{candidate.security_clearance}</Badge>
                </div>
              )}

              {candidate.ai_synopsis && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">AI Profile Summary:</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{candidate.ai_synopsis}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => handleViewProfile(candidate.id)}
                  className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Full Profile
                </Button>
                <Button variant="outline">
                  Save Candidate
                </Button>
                <Button variant="outline">
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
