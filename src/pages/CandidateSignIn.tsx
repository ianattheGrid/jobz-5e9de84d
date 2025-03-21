
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSignIn } from "@/hooks/useSignIn";
import NavBar from "@/components/NavBar";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

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
    <>
      <NavBar />
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="h-8 w-8 text-[#FF69B4]" />
              <CardTitle className={`text-2xl ${PRIMARY_COLOR_PATTERN}`}>Candidate Sign In</CardTitle>
            </div>
            <CardDescription>
              {resetMode ? "Reset your password" : "Sign in to access your profile"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={resetMode ? handleResetPassword : onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                />
              </div>
              {!resetMode && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    required
                  />
                </div>
              )}
              <Button className="w-full bg-[#FF69B4] hover:bg-[#FF50A8] text-white" type="submit" disabled={loading}>
                {loading ? (resetMode ? "Sending..." : "Signing in...") : (resetMode ? "Send Reset Link" : "Sign In")}
              </Button>
            </form>
            <div className="space-y-4 text-center">
              <div>
                {resetMode ? (
                  <button 
                    onClick={() => setResetMode(false)} 
                    className="font-medium text-[#FF69B4] hover:text-[#FF50A8] hover:underline transition-colors"
                  >
                    Back to Sign In
                  </button>
                ) : (
                  <button 
                    onClick={() => setResetMode(true)} 
                    className="font-medium text-[#FF69B4] hover:text-[#FF50A8] hover:underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/candidate/signup" className="text-[#FF69B4] hover:text-[#FF50A8] hover:underline font-medium transition-colors">
                  Sign Up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CandidateSignIn;
