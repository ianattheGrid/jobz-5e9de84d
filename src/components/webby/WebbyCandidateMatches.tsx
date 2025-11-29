import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Target, Sparkles, GraduationCap, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { WebbyCandidateCard } from './WebbyCandidateCard';
import { Button } from '@/components/ui/button';

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

interface WebbyCandidateMatchesProps {
  matches: {
    primary: CandidateMatch[];
    hidden_gems: CandidateMatch[];
    trainable: CandidateMatch[];
  };
  loading: boolean;
  onInterested: (candidateId: string) => void;
}

export const WebbyCandidateMatches = ({ matches, loading, onInterested }: WebbyCandidateMatchesProps) => {
  const [openSections, setOpenSections] = useState({
    primary: true,
    hidden_gems: true,
    trainable: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground">Finding candidates...</p>
      </div>
    );
  }

  const totalMatches = matches.primary.length + matches.hidden_gems.length + matches.trainable.length;

  if (totalMatches === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
        <Sparkles className="h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="font-semibold mb-2">No Matches Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Chat with Webby to refine your job requirements. As you describe what you're looking for, 
          we'll find candidates who match.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Primary Matches */}
      {matches.primary.length > 0 && (
        <Collapsible open={openSections.primary} onOpenChange={() => toggleSection('primary')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">Primary Matches</div>
                  <div className="text-xs text-muted-foreground">
                    Strong skills & experience match
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{matches.primary.length}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.primary ? 'rotate-180' : ''}`} />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3 px-1">
            {matches.primary.map((match) => (
              <WebbyCandidateCard
                key={match.candidate_id}
                match={match}
                onInterested={onInterested}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Hidden Gems */}
      {matches.hidden_gems.length > 0 && (
        <Collapsible open={openSections.hidden_gems} onOpenChange={() => toggleSection('hidden_gems')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">Hidden Gems</div>
                  <div className="text-xs text-muted-foreground">
                    Unique skills from hobbies & activities
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{matches.hidden_gems.length}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.hidden_gems ? 'rotate-180' : ''}`} />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3 px-1">
            {matches.hidden_gems.map((match) => (
              <WebbyCandidateCard
                key={match.candidate_id}
                match={match}
                onInterested={onInterested}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Trainable */}
      {matches.trainable.length > 0 && (
        <Collapsible open={openSections.trainable} onOpenChange={() => toggleSection('trainable')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">Trainable Talent</div>
                  <div className="text-xs text-muted-foreground">
                    Right attitude & soft skills
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{matches.trainable.length}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.trainable ? 'rotate-180' : ''}`} />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3 px-1">
            {matches.trainable.map((match) => (
              <WebbyCandidateCard
                key={match.candidate_id}
                match={match}
                onInterested={onInterested}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
