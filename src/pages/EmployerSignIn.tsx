
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSignIn } from "@/hooks/useSignIn";
import NavBar from "@/components/NavBar";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

const EmployerSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const { handleSignIn, loading } = useSignIn();
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(email, password);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/employer/signin`,
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
              <Building2 className="h-8 w-8 text-primary" />
              <CardTitle className={`text-2xl ${PRIMARY_COLOR_PATTERN}`}>Employer Sign In</CardTitle>
            </div>
            <CardDescription>
              {resetMode ? "Reset your password" : "Sign in to manage your job postings"}
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
              <Button 
                className="w-full bg-[#FF69B4] hover:bg-[#FF50A8] text-white" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (resetMode ? "Sending..." : "Signing in...") : (resetMode ? "Send Reset Link" : "Sign In")}
              </Button>
            </form>
            <div className="space-y-4 text-center">
              <div>
                {resetMode ? (
                  <a 
                    onClick={() => setResetMode(false)} 
                    className="text-[#FF69B4] hover:underline cursor-pointer text-sm"
                  >
                    Back to Sign In
                  </a>
                ) : (
                  <a 
                    onClick={() => setResetMode(true)} 
                    className="text-[#FF69B4] hover:underline cursor-pointer text-sm"
                  >
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/employer/signup" className="text-[#FF69B4] hover:underline">
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

export default EmployerSignIn;
