import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CandidateSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Starting sign in process...");

    try {
      console.log("Attempting to sign in with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Sign in response:", { data, error });

      if (error) throw error;

      if (!data?.user) {
        console.error("No user data returned");
        throw new Error('No user returned after successful sign in');
      }

      console.log("User data:", data.user);
      console.log("User metadata:", data.user.user_metadata);
      
      const userType = data.user.user_metadata?.user_type;
      console.log("User type:", userType);
      
      if (userType !== 'candidate') {
        console.log("Invalid user type, signing out");
        await supabase.auth.signOut();
        throw new Error('This login is only for candidates. Please use the appropriate sign in page.');
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
      
      navigate('/jobs');
    } catch (error: any) {
      console.error("Error during sign in:", error);
      
      let errorMessage = "An error occurred during sign in.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message?.includes('only for candidates')) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <UserRound className="h-8 w-8 text-red-800" />
            <CardTitle className="text-2xl">Candidate Sign In</CardTitle>
          </div>
          <CardDescription>
            {resetMode ? "Reset your password" : "Sign in to apply for jobs"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={resetMode ? handleResetPassword : handleSignIn} className="space-y-4">
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
            <Button className="w-full bg-red-800 hover:bg-red-900 text-white" type="submit" disabled={loading}>
              {loading ? (resetMode ? "Sending..." : "Signing in...") : (resetMode ? "Send Reset Link" : "Sign In")}
            </Button>
          </form>
          <div className="space-y-2 text-center text-sm text-muted-foreground">
            <div>
              {resetMode ? (
                <button 
                  onClick={() => setResetMode(false)} 
                  className="text-red-800 hover:underline"
                >
                  Back to Sign In
                </button>
              ) : (
                <button 
                  onClick={() => setResetMode(true)} 
                  className="text-red-800 hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div>
              Don't have an account?{" "}
              <Link to="/candidate/signup" className="text-red-800 hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateSignIn;
