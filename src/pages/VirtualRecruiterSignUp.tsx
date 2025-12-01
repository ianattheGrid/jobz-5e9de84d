
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import NavBar from "@/components/NavBar";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { SpaceCard } from "@/components/ui/space-card";
import { Link, Sparkles } from "lucide-react";

const VirtualRecruiterSignUp = () => {
  const { signUp, loading } = useSignUp();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (email: string, password: string, fullName: string) => {
    setError(null);
    try {
      console.log("Starting VR signup with:", { email, fullName });
      await signUp(email, password, 'vr', fullName);
    } catch (err: any) {
      console.error("VR signup error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <CosmicBackground mode="full">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="text-center mb-8 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <Link className="h-10 w-10 text-primary drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
              Become a Connector
            </h1>
            <p className="text-white/80 drop-shadow-lg">
              Join our network and help match great talent with amazing opportunities.
            </p>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <SpaceCard>
            <SignUpForm 
              onSubmit={handleSubmit} 
              loading={loading} 
              userType="vr"
              showCompanyField={false} 
              hideJobTitle={true}
            />
          </SpaceCard>
        </div>
      </div>
    </CosmicBackground>
  );
};

export default VirtualRecruiterSignUp;
