import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { WebbyToggle } from '@/components/webby/WebbyToggle';
import { WebbyChatInterface } from '@/components/webby/WebbyChatInterface';
import { useWebbyPreferences } from '@/hooks/useWebbyPreferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function WebbyEmployer() {
  const { preferences, loading, toggleWebby } = useWebbyPreferences('employer');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  const handleToggle = async (enabled: boolean) => {
    await toggleWebby(enabled);
    if (enabled && !preferences?.onboarding_completed) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate('/employer-dashboard');
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
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Webby AI Co-pilot</h1>
          </div>
          <p className="text-muted-foreground">
            Let AI help you create jobs and find the right candidates, faster
          </p>
        </div>

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
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Find Local Talent</CardTitle>
                  <CardDescription>
                    Get matched with candidates in your area who fit your needs
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Target className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Smart Matching</CardTitle>
                  <CardDescription>
                    See why each candidate matches your role with AI explanations
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Quick Outreach</CardTitle>
                  <CardDescription>
                    AI-drafted messages help you connect with candidates faster
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}

          {preferences?.webby_enabled && showOnboarding && !preferences?.onboarding_completed && (
            <Card>
              <CardHeader>
                <CardTitle>Create Your First Job with Webby</CardTitle>
                <CardDescription>
                  Have a quick chat with Webby to describe what you're looking for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WebbyChatInterface
                  userType="employer"
                  onComplete={handleOnboardingComplete}
                />
              </CardContent>
            </Card>
          )}

          {preferences?.webby_enabled && preferences?.onboarding_completed && (
            <Card>
              <CardHeader>
                <CardTitle>Webby is Ready to Help</CardTitle>
                <CardDescription>
                  Post jobs and find candidates with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Go to your dashboard to post jobs with Webby's help or see candidate matches.
                  </p>
                  <Button onClick={() => navigate('/employer-dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
