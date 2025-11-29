import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { WebbyToggle } from '@/components/webby/WebbyToggle';
import { WebbyChat } from '@/components/webby/WebbyChat';
import { WebbyMatches } from '@/components/webby/WebbyMatches';
import { WebbyLiveIndicator } from '@/components/webby/WebbyLiveIndicator';
import { WebbyIncomingInterest } from '@/components/webby/WebbyIncomingInterest';
import { WebbyMatchCelebration } from '@/components/webby/WebbyMatchCelebration';
import { useWebbyPreferences } from '@/hooks/useWebbyPreferences';
import { useWebbyPresence } from '@/hooks/useWebbyPresence';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Shield, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { supabase } from '@/integrations/supabase/client';

export default function WebbyCandidate() {
  const { preferences, loading, toggleWebby } = useWebbyPreferences('candidate');
  const { 
    onlineCount, 
    incomingInterest, 
    matchNotification,
    clearIncomingInterest,
    clearMatchNotification 
  } = useWebbyPresence('candidate');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [matchRefreshTrigger, setMatchRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleToggle = async (enabled: boolean) => {
    await toggleWebby(enabled);
    if (enabled && !preferences?.onboarding_completed) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setMatchRefreshTrigger(prev => prev + 1);
  };

  const handleProfileUpdate = () => {
    // Trigger matches refresh when profile is updated during chat
    setMatchRefreshTrigger(prev => prev + 1);
  };

  const handleInterested = async (jobId: number) => {
    try {
      // Fetch employer_id from the job
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('employer_id')
        .eq('id', jobId)
        .single();

      if (jobError || !job?.employer_id) {
        throw new Error('Could not find job employer');
      }

      const { data, error } = await supabase.functions.invoke('webby-express-interest', {
        body: {
          to_user_id: job.employer_id,
          interest_type: 'interested',
          job_id: jobId,
        },
      });

      if (error) throw error;

      if (data?.is_match) {
        toast({
          title: '🎉 Match!',
          description: 'You and the employer are both interested!',
        });
      } else {
        toast({
          title: 'Interest Registered',
          description: 'We\'ll notify the employer about your interest!',
        });
      }
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast({
        title: 'Error',
        description: 'Failed to register interest. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRespondToInterest = async () => {
    if (!incomingInterest) return;

    try {
      const { data, error } = await supabase.functions.invoke('webby-express-interest', {
        body: {
          to_user_id: incomingInterest.from_user_id,
          interest_type: 'interested',
          job_id: incomingInterest.job_id,
        },
      });

      if (error) throw error;

      if (data?.is_match) {
        toast({
          title: '🎉 Match!',
          description: 'You matched!',
        });
      }
      clearIncomingInterest();
    } catch (error) {
      console.error('Error responding to interest:', error);
      toast({
        title: 'Error',
        description: 'Failed to respond. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Webby AI Co-pilot</h1>
            </div>
            {preferences?.webby_enabled && (
              <WebbyLiveIndicator onlineCount={onlineCount} userType="candidate" />
            )}
          </div>
          <p className="text-muted-foreground">
            Let AI help you find local work that fits your life, without exposing yourself publicly
          </p>
        </div>

        <WebbyIncomingInterest
          open={!!incomingInterest}
          onOpenChange={(open) => !open && clearIncomingInterest()}
          data={incomingInterest ? {
            type: incomingInterest.type,
            from_user_type: incomingInterest.from_user_type,
          } : null}
          onInterested={handleRespondToInterest}
          onDismiss={clearIncomingInterest}
        />

        <WebbyMatchCelebration
          open={!!matchNotification}
          onOpenChange={(open) => !open && clearMatchNotification()}
          match={matchNotification}
          userType="candidate"
        />

        <div className="space-y-6">
          <WebbyToggle
            enabled={preferences?.webby_enabled || false}
            onToggle={handleToggle}
            loading={loading}
          />

          {!preferences?.webby_enabled && (
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <Shield className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Stay Anonymous</CardTitle>
                  <CardDescription>
                    Explore jobs without revealing your identity until you're ready
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Target className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Smart Matches</CardTitle>
                  <CardDescription>
                    Get curated job matches based on your skills, location, and preferences
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Quick Apply</CardTitle>
                  <CardDescription>
                    One-tap interest with AI-drafted messages you can edit
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}

          {preferences?.webby_enabled && (
            <div className="h-[calc(100vh-16rem)] border border-border rounded-lg overflow-hidden">
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={60} minSize={40}>
                  <WebbyChat
                    userType="candidate"
                    onComplete={handleOnboardingComplete}
                    onProfileUpdate={handleProfileUpdate}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40} minSize={30}>
                  <WebbyMatches
                    onInterested={handleInterested}
                    refreshTrigger={matchRefreshTrigger}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
