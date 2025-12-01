
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSignIn } from "@/hooks/useSignIn";
import NavBar from "@/components/NavBar";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { GlowCard, GlowCardContent, GlowCardDescription, GlowCardHeader, GlowCardTitle } from "@/components/ui/glow-card";
import { AnimatedInput } from "@/components/ui/animated-input";

const VirtualRecruiterSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const { handleSignIn, loading } = useSignIn();
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(email, password, 'vr');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/vr/signin`,
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
      setResetMode(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <CosmicBackground mode="light">
      <NavBar />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <GlowCard className="w-full max-w-md animate-fade-in">
          <GlowCardHeader className="space-y-3 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <LinkIcon className="h-8 w-8 text-primary" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <GlowCardTitle className="text-2xl">
              {resetMode ? "Reset Your Password" : "Welcome Back, Connector"}
            </GlowCardTitle>
            <GlowCardDescription>
              {resetMode 
                ? "Enter your email and we'll send you a reset link" 
                : "Ready to make more connections? Let's get you signed in."}
            </GlowCardDescription>
          </GlowCardHeader>
          <GlowCardContent className="space-y-6">
            <form onSubmit={resetMode ? handleResetPassword : onSubmit} className="space-y-4">
              <div className="space-y-2">
                <AnimatedInput
                  id="email"
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {!resetMode && (
                <div className="space-y-2">
                  <AnimatedInput
                    id="password"
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (resetMode ? "Sending..." : "Signing in...") : (resetMode ? "Send Reset Link" : "Sign In")}
              </Button>
            </form>
            <div className="space-y-4 text-center">
              <div>
                {resetMode ? (
                  <button 
                    onClick={() => setResetMode(false)} 
                    className="text-primary hover:underline cursor-pointer text-sm transition-colors"
                  >
                    Back to Sign In
                  </button>
                ) : (
                  <button 
                    onClick={() => setResetMode(true)} 
                    className="text-primary hover:underline cursor-pointer text-sm transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/vr/signup" className="text-primary hover:underline transition-colors">
                  Sign Up
                </Link>
              </div>
            </div>
          </GlowCardContent>
        </GlowCard>
      </div>
    </CosmicBackground>
  );
};

export default VirtualRecruiterSignIn;
