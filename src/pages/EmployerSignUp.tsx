
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import { rememberSource } from "@/utils/growth/source";
import NavBar from "@/components/NavBar";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { SpaceCard } from "@/components/ui/space-card";
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
    <CosmicBackground mode="full">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="text-center mb-8 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <Building2 className="h-10 w-10 text-primary drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
              Let's Find Your Next Hire
            </h1>
            <p className="text-white/80 drop-shadow-lg">
              Join the future of recruitment. Your perfect candidate is out there.
            </p>
            <p className="text-sm text-white/70 drop-shadow-lg">
              No spray-and-pray: candidates can send at most 10 applications a day here,
              and you can see how many roles each one applied for in the last month.
              Everyone who applies to you, meant to.
            </p>
          </div>
          <SpaceCard>
            <SignUpForm 
              onSubmit={handleSubmit} 
              loading={loading} 
              userType="employer"
              showCompanyField={true} 
            />
          </SpaceCard>
        </div>
      </div>
    </CosmicBackground>
  );
};

export default EmployerSignUp;
