
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import NavBar from "@/components/NavBar";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { UserPlus, Sparkles } from "lucide-react";

const CandidateSignUp = () => {
  const { signUp, loading } = useSignUp();

  const handleSubmit = async (email: string, password: string, fullName: string) => {
    await signUp(email, password, 'candidate', fullName, '');
  };

  return (
    <CosmicBackground mode="light">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="text-center mb-8 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <UserPlus className="h-10 w-10 text-primary" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Your Next Chapter Begins Here
            </h1>
            <p className="text-muted-foreground">
              Let's get you started. Amazing opportunities are waiting for you.
            </p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-border/50 hover:border-primary/30 transition-all duration-300">
            <SignUpForm 
              onSubmit={handleSubmit} 
              loading={loading} 
              userType="candidate"
              showCompanyField={false} 
            />
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
};

export default CandidateSignUp;
