
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import NavBar from "@/components/NavBar";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { SpaceCard } from "@/components/ui/space-card";
import { UserPlus, Sparkles } from "lucide-react";

const CandidateSignUp = () => {
  const { signUp, loading } = useSignUp();

  const handleSubmit = async (email: string, password: string, fullName: string) => {
    await signUp(email, password, 'candidate', fullName, '');
  };

  return (
    <CosmicBackground mode="full">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="text-center mb-8 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <UserPlus className="h-10 w-10 text-primary drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
              Your Next Chapter Begins Here
            </h1>
            <p className="text-white/80 drop-shadow-lg">
              Let's get you started. Amazing opportunities are waiting for you.
            </p>
          </div>
          <SpaceCard>
            <SignUpForm 
              onSubmit={handleSubmit} 
              loading={loading} 
              userType="candidate"
              showCompanyField={false} 
            />
          </SpaceCard>
        </div>
      </div>
    </CosmicBackground>
  );
};

export default CandidateSignUp;
