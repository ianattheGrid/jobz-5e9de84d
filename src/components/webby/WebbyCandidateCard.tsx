import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Award, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CandidateMatch {
  candidate_id: string;
  match_score: number;
  match_reason: string;
  candidate: {
    id: string;
    full_name: string | null;
    job_title: string;
    location: string[] | null;
    years_experience: number;
    required_skills: string[] | null;
    profile_picture_url: string | null;
  };
}

interface WebbyCandidateCardProps {
  match: CandidateMatch;
  onInterested: (candidateId: string) => void;
}

export const WebbyCandidateCard = ({ match, onInterested }: WebbyCandidateCardProps) => {
  const { candidate, match_score, match_reason } = match;
  const initials = candidate.full_name?.split(' ').map(n => n[0]).join('') || '?';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={candidate.profile_picture_url || undefined} alt={candidate.full_name || 'Candidate'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base mb-1">{candidate.full_name || 'Anonymous Candidate'}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <Briefcase className="h-3 w-3" />
                {candidate.job_title}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {match_score}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-muted-foreground">{match_reason}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {candidate.location && candidate.location.length > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {candidate.location[0]}
            </div>
          )}
          {candidate.years_experience > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Award className="h-3 w-3" />
              {candidate.years_experience} years exp
            </div>
          )}
        </div>

        {candidate.required_skills && candidate.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {candidate.required_skills.slice(0, 3).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {candidate.required_skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{candidate.required_skills.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <Button 
          onClick={() => onInterested(candidate.id)}
          className="w-full"
          size="sm"
        >
          Express Interest
        </Button>
      </CardContent>
    </Card>
  );
};
