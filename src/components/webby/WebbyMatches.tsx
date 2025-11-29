import { useState } from 'react';
import { Loader2, ChevronDown, ChevronUp, Target, Sparkles, Compass } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { WebbyJobCard } from './WebbyJobCard';
import { useWebbyMatches } from '@/hooks/useWebbyMatches';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface WebbyMatchesProps {
  onInterested: (jobId: number) => void;
  refreshTrigger?: number;
}

export const WebbyMatches = ({ onInterested, refreshTrigger }: WebbyMatchesProps) => {
  const { matches, loading, error } = useWebbyMatches(refreshTrigger);
  const [openSections, setOpenSections] = useState({
    primary: true,
    serendipitous: true,
    unexpected: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <div className="text-center">
          <p className="font-semibold text-foreground">Finding your perfect matches...</p>
          <p className="text-sm text-muted-foreground">Webby is analyzing jobs just for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-destructive">Failed to load matches</p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!matches || (matches.primary.length === 0 && matches.serendipitous.length === 0 && matches.unexpected.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <Sparkles className="w-16 h-16 text-muted-foreground/50" />
        <div>
          <p className="font-semibold text-foreground">Chat with Webby to unlock matches</p>
          <p className="text-sm text-muted-foreground mt-2">
            As you share more about yourself, personalized job matches will appear here in real-time
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Your Matches</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {matches.primary.length + matches.serendipitous.length + matches.unexpected.length} jobs found
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Primary Matches */}
          {matches.primary.length > 0 && (
            <Collapsible open={openSections.primary} onOpenChange={() => toggleSection('primary')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="font-semibold">🎯 Primary Matches</span>
                    <span className="text-xs text-muted-foreground">({matches.primary.length})</span>
                  </div>
                  {openSections.primary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                {matches.primary.map(job => (
                  <WebbyJobCard
                    key={job.id}
                    job={job}
                    matchCategory="primary"
                    onInterested={onInterested}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Serendipitous Matches */}
          {matches.serendipitous.length > 0 && (
            <Collapsible open={openSections.serendipitous} onOpenChange={() => toggleSection('serendipitous')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="font-semibold">✨ Serendipitous</span>
                    <span className="text-xs text-muted-foreground">({matches.serendipitous.length})</span>
                  </div>
                  {openSections.serendipitous ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                {matches.serendipitous.map(job => (
                  <WebbyJobCard
                    key={job.id}
                    job={job}
                    matchCategory="serendipitous"
                    onInterested={onInterested}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Unexpected Paths */}
          {matches.unexpected.length > 0 && (
            <Collapsible open={openSections.unexpected} onOpenChange={() => toggleSection('unexpected')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-secondary" />
                    <span className="font-semibold">🔮 Unexpected Paths</span>
                    <span className="text-xs text-muted-foreground">({matches.unexpected.length})</span>
                  </div>
                  {openSections.unexpected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                {matches.unexpected.map(job => (
                  <WebbyJobCard
                    key={job.id}
                    job={job}
                    matchCategory="unexpected"
                    onInterested={onInterested}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};