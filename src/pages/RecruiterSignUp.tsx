import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const RecruiterSignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: 'recruiter'
          }
        }
      });

      if (authError) throw authError;

      // Create recruiter profile
      const { error: profileError } = await supabase
        .from('recruiter_profiles')
        .insert([
          {
            id: authData.user?.id,
            full_name: fullName,
            experience_years: parseInt(experience),
            verification_status: 'pending'
          }
        ]);

      if (profileError) throw profileError;

      toast({
        title: "Success!",
        description: "Your account is pending verification. We'll review your application shortly.",
      });
      
      navigate('/jobs');
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
            <Users className="h-8 w-8 text-red-800" />
            <CardTitle className="text-2xl">Virtual Recruiter Sign Up</CardTitle>
          </div>
          <CardDescription>
            Create an account to start recruiting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name" 
                required
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Recruiting Experience</Label>
              <Input 
                id="experience" 
                type="number" 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Enter years of experience" 
                required
              />
            </div>
            <Button className="w-full bg-red-800 hover:bg-red-900 text-white" type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/recruiter/signin" className="text-red-800 hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterSignUp;