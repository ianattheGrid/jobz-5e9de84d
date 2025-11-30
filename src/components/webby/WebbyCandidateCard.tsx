import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Briefcase, Eye, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { getDescriptivePseudonym, getRoughLocation, formatPayRange, formatAvailability } from '@/lib/anonymize';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWebbyInterestStatus, getStatusLabels } from '@/hooks/useWebbyInterestStatus';

interface CandidateMatch {
  candidate_id: string;
  match_score: number;
  match_reason: string;
  employer_id?: string;
  job_id?: number;
  candidate: {
    id: string;
    full_name: string | null;
    job_title: string;
    location: string[] | null;
    years_experience: number;
    required_skills: string[] | null;
    profile_picture_url: string | null;
  };
  webby_profile?: {
    rough_location?: string | null;
    min_hourly_rate?: number | null;
    min_annual_salary?: number | null;
    availability_slots?: any;
    hours_per_week_min?: number | null;
    hours_per_week_max?: number | null;
    skills_tags?: string[] | null;
  };
}

interface WebbyCandidateCardProps {
  match: CandidateMatch;
  onInterested: (candidateId: string) => void;
  onViewOverview: (candidateId: string) => void;
  onDismiss?: (candidateId: string) => void;
}

export const WebbyCandidateCard = ({ match, onInterested, onViewOverview, onDismiss }: WebbyCandidateCardProps) => {
  const { candidate, match_score, match_reason, webby_profile } = match;
  const [isOnline, setIsOnline] = useState(false);
  const { statusData, loading: statusLoading } = useWebbyInterestStatus(
    candidate.id,
    match.employer_id || '',
    match.job_id || 0
  );

  // Generate anonymous pseudonym
  const pseudonym = getDescriptivePseudonym(
    candidate.id,
    'candidate',
    candidate.job_title
  );

  // Get rough location
  const area = webby_profile?.rough_location || getRoughLocation(candidate.location);

  // Format pay range
  const payRange = formatPayRange(
    webby_profile?.min_hourly_rate,
    webby_profile?.min_annual_salary
  );

  // Format availability
  const availability = formatAvailability(
    webby_profile?.availability_slots,
    webby_profile?.hours_per_week_min,
    webby_profile?.hours_per_week_max
  );

  // Get skills (prefer webby skills, fallback to profile skills)
  const skills = webby_profile?.skills_tags || candidate.required_skills || [];

  // Check if candidate is online
  useEffect(() => {
    const checkPresence = async () => {
      const { data } = await supabase
        .from('webby_presence')
        .select('is_online')
        .eq('user_id', candidate.id)
        .single();
      
      setIsOnline(data?.is_online || false);
    };

    checkPresence();

    // Subscribe to presence changes
    const channel = supabase
      .channel(`presence:${candidate.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'webby_presence',
          filter: `user_id=eq.${candidate.id}`
        },
        (payload) => {
          if (payload.new && 'is_online' in payload.new) {
            setIsOnline(payload.new.is_online);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [candidate.id]);

  const handleInterested = () => {
    onInterested(candidate.id);
  };

  // Get status labels
  const { employerLabel } = getStatusLabels(
    statusData,
    isOnline,
    statusData?.candidate_first_name || undefined
  );

  // Don't show declined candidates
  if (statusData?.status === 'declined') {
    return null;
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Header with Pseudonym and Match Score */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight">{pseudonym}</h3>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {match_score}%
          </Badge>
        </div>

        {/* Quick Info */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>Area: {area}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{availability}</span>
          </div>
          {skills.length > 0 && (
            <div className="flex items-start gap-1.5">
              <Briefcase className="h-3 w-3 shrink-0 mt-0.5" />
              <span className="line-clamp-1">
                Skills: {skills.slice(0, 3).join(', ')}
                {skills.length > 3 && ` +${skills.length - 3} more`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="font-medium">💷</span>
            <span>Looking for: {payRange}</span>
          </div>
        </div>

        {/* Match Reason */}
        <div className="p-2 bg-muted/50 rounded text-xs">
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">Good fit:</span> {match_reason}
            </span>
          </div>
        </div>

        {/* Status Display */}
        {employerLabel && (
          <div className="flex items-center gap-1.5 text-xs">
            {statusData?.status === 'matched' && isOnline && (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-600 dark:text-green-500">{employerLabel}</span>
              </>
            )}
            {statusData?.status === 'employer_interested' && (
              <>
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{employerLabel}</span>
              </>
            )}
            {statusData?.status === 'candidate_viewed' && (
              <>
                <Clock className="h-3 w-3 text-primary" />
                <span className="text-primary">{employerLabel}</span>
              </>
            )}
            {statusData?.status === 'candidate_interested_anon' && (
              <>
                <CheckCircle2 className="h-3 w-3 text-primary" />
                <span className="text-primary">{employerLabel}</span>
              </>
            )}
            {statusData?.status === 'chatting' && (
              <>
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-primary">{employerLabel}</span>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            onClick={() => onViewOverview(candidate.id)}
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 text-xs h-8"
          >
            <Eye className="h-3 w-3" />
            View overview
          </Button>
          <Button
            onClick={handleInterested}
            size="sm"
            className="flex-1 gap-1.5 text-xs h-8"
            disabled={statusLoading || (statusData?.status && statusData.status !== 'matched')}
          >
            <Sparkles className="h-3 w-3" />
            {statusData?.status === 'matched' || !statusData ? "I'm interested" : 'Invited'}
          </Button>
        </div>

        {/* Optional Dismiss */}
        {onDismiss && (!statusData || statusData.status === 'matched') && (
          <Button
            onClick={() => onDismiss(candidate.id)}
            variant="ghost"
            size="sm"
            className="w-full text-xs h-7 text-muted-foreground hover:text-foreground"
          >
            Not a fit
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
