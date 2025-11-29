import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { WebbyToggle } from '@/components/webby/WebbyToggle';
import { WebbyChatInterface } from '@/components/webby/WebbyChatInterface';
import { useWebbyPreferences } from '@/hooks/useWebbyPreferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Shield, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function WebbyCandidate() {
  const { preferences, loading, toggleWebby } = useWebbyPreferences('candidate');
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
    navigate('/candidate-dashboard');
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
            Let AI help you find local work that fits your life, without exposing yourself publicly
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

          {preferences?.webby_enabled && showOnboarding && !preferences?.onboarding_completed && (
            <Card>
              <CardHeader>
                <CardTitle>Let's Get You Set Up</CardTitle>
                <CardDescription>
                  Have a quick chat with Webby to understand what you're looking for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WebbyChatInterface
                  userType="candidate"
                  onComplete={handleOnboardingComplete}
                />
              </CardContent>
            </Card>
          )}

          {preferences?.webby_enabled && preferences?.onboarding_completed && (
            <Card>
              <CardHeader>
                <CardTitle>Your Webby Profile is Active</CardTitle>
                <CardDescription>
                  Webby is now helping you find matching jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Check your dashboard to see personalized job recommendations from Webby.
                  </p>
                  <Button onClick={() => navigate('/candidate-dashboard')}>
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
