
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface SearchResultsProps {
  candidates: CandidateProfile[];
}

export function SearchResults({ candidates }: SearchResultsProps) {
  const navigate = useNavigate();

  if (candidates.length === 0) {
    return <p className="text-gray-500">No candidates found matching your criteria.</p>;
  }

  const handleViewProfile = (candidateId: string) => {
    navigate(`/employer/view-candidate/${candidateId}`);
  };

  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <Card key={candidate.id}>
          <CardHeader>
            <CardTitle>{candidate.job_title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-semibold">Experience:</span> {candidate.years_experience} years</p>
              <p><span className="font-semibold">Location:</span> {candidate.location.join(", ")}</p>
              <p><span className="font-semibold">Salary Range:</span> £{candidate.min_salary.toLocaleString()} - £{candidate.max_salary.toLocaleString()}</p>
              {candidate.commission_percentage !== null && (
                <p><span className="font-semibold">Desired "You're Hired" Bonus:</span> {candidate.commission_percentage}%</p>
              )}
              {candidate.required_qualifications && candidate.required_qualifications.length > 0 && (
                <p><span className="font-semibold">Qualifications:</span> {candidate.required_qualifications.join(', ')}</p>
              )}
              {candidate.required_skills && candidate.required_skills.length > 0 && (
                <p><span className="font-semibold">IT Skills:</span> {candidate.required_skills.join(', ')}</p>
              )}
              {candidate.security_clearance && (
                <p><span className="font-semibold">Security Clearance:</span> {candidate.security_clearance}</p>
              )}
              <div className="mt-4">
                <Button 
                  onClick={() => handleViewProfile(candidate.id)}
                  variant="outline"
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Full Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
