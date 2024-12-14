import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CandidateProfile {
  id: string;
  job_title: string;
  years_experience: number;
  location: string;
  min_salary: number;
  max_salary: number;
  required_qualifications?: string[];
}

interface SearchResultsProps {
  candidates: CandidateProfile[];
}

export function SearchResults({ candidates }: SearchResultsProps) {
  if (candidates.length === 0) {
    return <p className="text-gray-500">No candidates found matching your criteria.</p>;
  }

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
              <p><span className="font-semibold">Location:</span> {candidate.location}</p>
              <p><span className="font-semibold">Salary Range:</span> £{candidate.min_salary.toLocaleString()} - £{candidate.max_salary.toLocaleString()}</p>
              {candidate.required_qualifications && candidate.required_qualifications.length > 0 && (
                <p><span className="font-semibold">Qualifications:</span> {candidate.required_qualifications.join(', ')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}