import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { WebbyToggle } from '@/components/webby/WebbyToggle';
import { WebbyChat } from '@/components/webby/WebbyChat';
import { WebbyCandidateMatches } from '@/components/webby/WebbyCandidateMatches';
import { WebbyLiveIndicator } from '@/components/webby/WebbyLiveIndicator';
import { WebbyIncomingInterest } from '@/components/webby/WebbyIncomingInterest';
import { WebbyMatchCelebration } from '@/components/webby/WebbyMatchCelebration';
import { WebbyQuickLookAnonymous } from '@/components/webby/WebbyQuickLookAnonymous';
import { WebbyEmployerToggles } from '@/components/webby/WebbyEmployerToggles';
import { useWebbyPreferences } from '@/hooks/useWebbyPreferences';
import { useWebbyEmployerMatches } from '@/hooks/useWebbyEmployerMatches';
import { useWebbyPresence } from '@/hooks/useWebbyPresence';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Sparkles, Users, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CosmicBackground } from '@/components/ui/cosmic-background';

export default function WebbyEmployer() {
  const { preferences, loading, toggleWebby } = useWebbyPreferences('employer');
  const { matches, loading: matchesLoading, refresh: refreshMatches } = useWebbyEmployerMatches();
  const { 
    onlineCount, 
    incomingInterest, 
    matchNotification,
    clearIncomingInterest,
    clearMatchNotification 
  } = useWebbyPresence('employer');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [quickLookCandidate, setQuickLookCandidate] = useState<any>(null);
  const [dismissedCandidates, setDismissedCandidates] = useState<Set<string>>(new Set());
  const [employerPreferences, setEmployerPreferences] = useState({
    open_to_career_switchers: false,
    willing_to_train_on_the_job: false,
    values_soft_skills_over_experience: false
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleToggle = async (enabled: boolean) => {
    await toggleWebby(enabled);
    if (enabled && !preferences?.onboarding_completed) {
      setShowOnboarding(true);
    }
  };

  const handleEmployerToggle = async (field: string, value: boolean) => {
    setEmployerPreferences(prev => ({ ...prev, [field]: value }));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('employer_profiles')
        .update({ [field]: value })
        .eq('id', user.id);

      toast({
        title: 'Preferences updated',
        description: 'Your hiring preferences have been saved.'
      });

      // Refresh matches to apply new preferences
      refreshMatches();
    } catch (error) {
      console.error('Error updating employer preferences:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update preferences.'
      });
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate('/employer-dashboard');
  };

  const handleProfileUpdate = () => {
    console.log('Employer job spec updated, refreshing matches...');
    refreshMatches();
  };

  const handleInterested = async (candidateId: string) => {
    try {
      // Check if candidate is online
      const { data: presenceData } = await supabase
        .from('webby_presence')
        .select('is_online')
        .eq('user_id', candidateId)
        .single();

      const isOnline = presenceData?.is_online || false;

      const { data, error } = await supabase.functions.invoke('webby-express-interest', {
        body: {
          to_user_id: candidateId,
          interest_type: 'interested',
        },
      });

      if (error) throw error;

      if (data?.is_match) {
        toast({
          title: '🎉 It\'s a Match!',
          description: 'You and the candidate are both interested!',
        });
      } else {
        // Context-aware message based on online status
        const description = isOnline
          ? "Nice choice. I've pinged this candidate in real time. If they're interested, I'll let you know here."
          : "Good pick. This candidate isn't online right now, but I've sent them an alert about your role. As soon as they see it and respond, I'll update you here.";
        
        toast({
          title: 'Interest Expressed',
          description,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast({
        title: 'Error',
        description: 'Failed to express interest. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleViewOverview = (candidateId: string) => {
    const candidate = [
      ...matches.primary,
      ...matches.hidden_gems,
      ...matches.trainable
    ].find(m => m.candidate_id === candidateId);

    if (candidate) {
      setQuickLookCandidate(candidate);
    }
  };

  const handleDismiss = (candidateId: string) => {
    setDismissedCandidates(prev => new Set([...prev, candidateId]));
    toast({
      title: 'Candidate Dismissed',
      description: 'This candidate won\'t be shown again.',
    });
  };

  const handleInviteToChat = async (candidateId: string) => {
    await handleInterested(candidateId);
  };

  const handleRespondToInterest = async () => {
    if (!incomingInterest) return;

    await handleInterested(incomingInterest.from_user_id);
    clearIncomingInterest();
  };

  if (loading) {
    return (
      <CosmicBackground mode="full">
        <NavBar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground mode="full">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" style={{ animationDuration: '3s' }} />
              <h1 className="text-3xl font-bold text-white">Webby AI Co-pilot</h1>
            </div>
            {preferences?.webby_enabled && (
              <WebbyLiveIndicator onlineCount={onlineCount} userType="employer" />
            )}
          </div>
          <p className="text-white/80 text-lg">
            Let AI help you create jobs and find the right candidates, faster
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
          userType="employer"
        />

        <WebbyQuickLookAnonymous
          open={!!quickLookCandidate}
          onOpenChange={(open) => !open && setQuickLookCandidate(null)}
          data={quickLookCandidate ? {
            id: quickLookCandidate.candidate_id,
            job_title: quickLookCandidate.candidate.job_title,
            location: quickLookCandidate.candidate.location,
            years_experience: quickLookCandidate.candidate.years_experience,
            skills: quickLookCandidate.candidate.required_skills,
            match_score: quickLookCandidate.match_score,
            match_reason: quickLookCandidate.match_reason,
            webby_profile: quickLookCandidate.webby_profile,
          } : null}
          userType="employer"
          onInviteToChat={handleInviteToChat}
          onNotRight={handleDismiss}
        />

        <div className="space-y-6">
          <WebbyToggle
            enabled={preferences?.webby_enabled || false}
            onToggle={handleToggle}
            loading={loading}
          />

          {preferences?.webby_enabled && (
            <WebbyEmployerToggles
              openToCareerSwitchers={employerPreferences.open_to_career_switchers}
              willingToTrainOnTheJob={employerPreferences.willing_to_train_on_the_job}
              valuesSoftSkillsOverExperience={employerPreferences.values_soft_skills_over_experience}
              onToggle={handleEmployerToggle}
            />
          )}

          {!preferences?.webby_enabled && (
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-black/40 backdrop-blur-xl border-primary/30 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg text-white">Find Local Talent</CardTitle>
                  <CardDescription className="text-white/70">
                    Get matched with candidates in your area who fit your needs
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-primary/30 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Target className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg text-white">Smart Matching</CardTitle>
                  <CardDescription className="text-white/70">
                    See why each candidate matches your role with AI explanations
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-primary/30 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Zap className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg text-white">Quick Outreach</CardTitle>
                  <CardDescription className="text-white/70">
                    AI-drafted messages help you connect with candidates faster
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}

          {preferences?.webby_enabled && (
            <div className="h-[calc(100vh-16rem)]">
              <ResizablePanelGroup direction="horizontal" className="rounded-lg border border-primary/30 shadow-lg shadow-primary/20 overflow-hidden">
                <ResizablePanel defaultSize={60} minSize={40}>
                  <div className="h-full flex flex-col bg-black/40 backdrop-blur-xl">
                    <div className="border-b border-primary/30 p-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                        <h2 className="font-semibold text-white">Chat with Webby</h2>
                      </div>
                      <p className="text-xs text-white/70 mt-1">
                        {!preferences?.onboarding_completed 
                          ? "Describe your ideal candidate and watch matches appear"
                          : "Refine your search or create new job specs"
                        }
                      </p>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <WebbyChat
                        userType="employer"
                        onComplete={handleOnboardingComplete}
                        onProfileUpdate={handleProfileUpdate}
                      />
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle className="bg-primary/20" />
                
                <ResizablePanel defaultSize={40} minSize={30}>
                  <div className="h-full flex flex-col bg-black/30 backdrop-blur-xl">
                    <div className="border-b border-primary/30 p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h2 className="font-semibold text-white">Candidate Matches</h2>
                      </div>
                      <p className="text-xs text-white/70 mt-1">
                        Live matches based on your conversation
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <WebbyCandidateMatches
                        matches={matches}
                        loading={matchesLoading}
                        onInterested={handleInterested}
                        onViewOverview={handleViewOverview}
                        onDismiss={handleDismiss}
                      />
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          )}
        </div>
      </div>
    </CosmicBackground>
  );
}
