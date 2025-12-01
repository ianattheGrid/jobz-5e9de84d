
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSignIn } from "@/hooks/useSignIn";
import NavBar from "@/components/NavBar";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { SpaceCard } from "@/components/ui/space-card";
import { AnimatedInput } from "@/components/ui/animated-input";

const CandidateSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const { handleSignIn, loading } = useSignIn();
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(email, password, 'candidate');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/candidate/signin`,
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
    <CosmicBackground mode="full">
      <NavBar />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <SpaceCard className="w-full max-w-md animate-fade-in">
          <div className="space-y-3 text-center mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <UserPlus className="h-8 w-8 text-primary drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
              {resetMode ? "Reset Your Password" : "Welcome Back, Explorer"}
            </h1>
            <p className="text-sm text-white/70">
              {resetMode 
                ? "Enter your email and we'll send you a reset link" 
                : "Your next chapter is waiting. Let's get you back on track."}
            </p>
          </div>
          <div className="space-y-6">
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
                    className="text-primary hover:text-primary/80 cursor-pointer text-sm transition-colors drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                  >
                    Back to Sign In
                  </button>
                ) : (
                  <button 
                    onClick={() => setResetMode(true)} 
                    className="text-primary hover:text-primary/80 cursor-pointer text-sm transition-colors drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="text-sm text-white/70">
                Don't have an account?{" "}
                <Link to="/candidate/signup" className="text-primary hover:text-primary/80 transition-colors drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </SpaceCard>
      </div>
    </CosmicBackground>
  );
};

export default CandidateSignIn;
