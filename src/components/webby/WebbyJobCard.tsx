import { MapPin, DollarSign, Briefcase, Sparkles, Eye, Clock, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useWebbyInterestStatus, getStatusLabels } from '@/hooks/useWebbyInterestStatus';
import { supabase } from '@/integrations/supabase/client';
import { WebbyCandidateResponseSheet } from './WebbyCandidateResponseSheet';
import { WebbyJobDeclineSheet } from './WebbyJobDeclineSheet';

interface WebbyJobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    salary_min: number;
    salary_max: number;
    type: string;
    match_reason: string;
    match_score: number;
    employer_id?: string;
  };
  matchCategory: 'primary' | 'serendipitous' | 'unexpected';
  onInterested: (jobId: number) => void;
  onViewOverview?: (jobId: number) => void;
}

export const WebbyJobCard = ({ job, matchCategory, onInterested, onViewOverview }: WebbyJobCardProps) => {
  const [showResponseSheet, setShowResponseSheet] = useState(false);
  const [showDeclineSheet, setShowDeclineSheet] = useState(false);
  const [userId, setUserId] = useState<string>('');

  // Get user ID
  useState(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  });

  // Get interest status if we have employer_id
  const { statusData, loading: statusLoading } = useWebbyInterestStatus(
    userId,
    job.employer_id || '',
    job.id
  );

  const categoryColors = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    serendipitous: 'bg-accent/10 text-accent-foreground border-accent/20',
    unexpected: 'bg-secondary/10 text-secondary-foreground border-secondary/20'
  };

  const categoryIcons = {
    primary: '🎯',
    serendipitous: '✨',
    unexpected: '🔮'
  };

  const handleViewOverview = async () => {
    if (onViewOverview) {
      onViewOverview(job.id);
    }
    
    // Mark as viewed if employer has shown interest
    if (statusData?.status === 'employer_interested' && userId && job.employer_id) {
      await supabase
        .from('webby_interests')
        .update({
          status: 'candidate_viewed',
          candidate_viewed_at: new Date().toISOString()
        })
        .eq('candidate_id', userId)
        .eq('employer_id', job.employer_id)
        .eq('job_id', job.id);
    }
  };

  const handleInterested = () => {
    if (statusData?.status === 'employer_interested') {
      // Show response sheet if employer already expressed interest
      setShowResponseSheet(true);
    } else {
      // Normal interest flow
      onInterested(job.id);
    }
  };

  // Get status labels
  const { candidateLabel } = getStatusLabels(
    statusData,
    false,
    undefined,
    job.company
  );

  // Don't show declined jobs
  if (statusData?.status === 'declined') {
    return null;
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">{job.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{job.company}</p>
            </div>
            <Badge variant="outline" className={categoryColors[matchCategory]}>
              {categoryIcons[matchCategory]} {Math.round(job.match_score)}%
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              £{job.salary_min.toLocaleString()}-£{job.salary_max.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {job.type}
            </span>
          </div>

          <div className="bg-muted/50 rounded-md p-2">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {job.match_reason}
              </p>
            </div>
          </div>

          {/* Status Display */}
          {candidateLabel && (
            <div className="flex items-center gap-1.5 text-xs">
              {statusData?.status === 'employer_interested' && (
                <>
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-primary font-medium">{candidateLabel}</span>
                </>
              )}
              {statusData?.status === 'candidate_viewed' && (
                <>
                  <Eye className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{candidateLabel}</span>
                </>
              )}
              {statusData?.status === 'candidate_interested_anon' && (
                <>
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  <span className="text-primary">{candidateLabel}</span>
                </>
              )}
              {statusData?.status === 'chatting' && (
                <>
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-primary font-medium">{candidateLabel}</span>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowDeclineSheet(true)}
              variant="ghost"
              className="flex-shrink-0"
              size="sm"
            >
              <X className="h-3 w-3" />
            </Button>
            {onViewOverview && (
              <Button 
                onClick={handleViewOverview}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
            <Button 
              onClick={handleInterested}
              className="flex-1"
              size="sm"
              disabled={statusLoading || (statusData?.status === 'chatting')}
            >
              {statusData?.status === 'employer_interested' ? 'Respond' : 
               statusData?.status === 'candidate_interested_anon' ? 'Interested' :
               statusData?.status === 'chatting' ? 'Chatting' : 
               "I'm Interested"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Response Sheet */}
      <WebbyCandidateResponseSheet
        open={showResponseSheet}
        onOpenChange={setShowResponseSheet}
        jobId={job.id}
        employerId={job.employer_id || ''}
        roleTitle={job.title}
        area={job.location}
        payRange={`£${job.salary_min.toLocaleString()}-£${job.salary_max.toLocaleString()}`}
        onResponse={() => {
          // Refresh will happen via real-time subscription
        }}
      />

      {/* Decline Sheet */}
      <WebbyJobDeclineSheet
        open={showDeclineSheet}
        onOpenChange={setShowDeclineSheet}
        jobId={job.id}
        jobTitle={job.title}
        onDeclineComplete={() => {
          // Refresh matches to remove this job
          window.location.reload();
        }}
      />
    </>
  );
};
