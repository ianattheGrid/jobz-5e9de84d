
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import NavBar from "@/components/NavBar";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { Building2, Sparkles } from "lucide-react";

const EmployerSignUp = () => {
  const { signUp, loading } = useSignUp();

  const handleSubmit = async (
    email: string, 
    password: string, 
    fullName: string,
    jobTitle?: string,
    companyName?: string, 
    companyWebsite?: string,
    companySize?: number
  ) => {
    await signUp(
      email, 
      password, 
      'employer', 
      fullName, 
      jobTitle || '',
      companyName || '', 
      companyWebsite || '',
      companySize || 0
    );
  };

  return (
    <CosmicBackground mode="light">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="text-center mb-8 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <Building2 className="h-10 w-10 text-primary" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Let's Find Your Next Hire
            </h1>
            <p className="text-muted-foreground">
              Join the future of recruitment. Your perfect candidate is out there.
            </p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-border/50 hover:border-primary/30 transition-all duration-300">
            <SignUpForm 
              onSubmit={handleSubmit} 
              loading={loading} 
              userType="employer"
              showCompanyField={true} 
            />
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
};

export default EmployerSignUp;
