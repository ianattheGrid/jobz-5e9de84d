import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound } from "lucide-react";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";

const CandidateSignUp = () => {
  const { handleSignUp, loading } = useSignUp();

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <UserRound className="h-8 w-8 text-red-800" />
            <CardTitle className="text-2xl">Candidate Sign Up</CardTitle>
          </div>
          <CardDescription>
            Create a candidate account to apply for jobs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm onSubmit={handleSignUp} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateSignUp;