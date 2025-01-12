import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import NavBar from "@/components/NavBar";

const EmployerSignUp = () => {
  const { handleSignUp, loading } = useSignUp('employer');

  return (
    <>
      <NavBar />
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Building2 className="h-8 w-8 text-[#9b87f5]" />
              <CardTitle className="text-2xl">Employer Sign Up</CardTitle>
            </div>
            <CardDescription>
              Create an employer account to post job vacancies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignUpForm 
              onSubmit={handleSignUp} 
              loading={loading}
              userType="employer"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EmployerSignUp;