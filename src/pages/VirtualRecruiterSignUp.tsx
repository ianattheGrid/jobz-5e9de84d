import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import NavBar from "@/components/NavBar";

const VirtualRecruiterSignUp = () => {
  const { handleSignUp, loading } = useSignUp('vr');

  return (
    <>
      <NavBar />
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Virtual Recruiter Sign Up</CardTitle>
            </div>
            <CardDescription>
              Create a Virtual Recruiter account to start recommending candidates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignUpForm 
              onSubmit={handleSignUp} 
              loading={loading}
              userType="vr"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VirtualRecruiterSignUp;