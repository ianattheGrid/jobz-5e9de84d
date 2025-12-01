
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSignUp } from "@/hooks/useSignUp";
import NavBar from "@/components/NavBar";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CosmicBackground } from "@/components/ui/cosmic-background";
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
    <CosmicBackground mode="light">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="text-center mb-8 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <Link className="h-10 w-10 text-primary" />
                <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Become a Connector
            </h1>
            <p className="text-muted-foreground">
              Join our network and help match great talent with amazing opportunities.
            </p>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="bg-card/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-border/50 hover:border-primary/30 transition-all duration-300">
            <SignUpForm 
              onSubmit={handleSubmit} 
              loading={loading} 
              userType="vr"
              showCompanyField={false} 
              hideJobTitle={true}
            />
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
};

export default VirtualRecruiterSignUp;
