import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { SpaceCard } from "@/components/ui/space-card";
import { Building2, UserPlus, Link, Sparkles } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <CosmicBackground mode="full">
      <NavBar />
      <div className="container mx-auto px-4 py-16 pt-24">
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
              Welcome to Your Next Great Opportunity
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto drop-shadow-lg">
              Join thousands of professionals finding their perfect match. Choose your path below.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <SpaceCard className="cursor-pointer transition-transform hover:scale-105">
              <div 
                className="text-center space-y-4"
                onClick={() => navigate("/employer/signup")}
              >
                <div className="flex justify-center relative">
                  <Building2 className="h-16 w-16 text-primary drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
                  <Sparkles className="h-6 w-6 text-primary absolute -top-2 -right-2 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-white">For Employers</h2>
                <p className="text-white/70">
                  Find exceptional talent that fits your company culture and requirements.
                </p>
              </div>
            </SpaceCard>

            <SpaceCard className="cursor-pointer transition-transform hover:scale-105">
              <div 
                className="text-center space-y-4"
                onClick={() => navigate("/candidate/signup")}
              >
                <div className="flex justify-center relative">
                  <UserPlus className="h-16 w-16 text-primary drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
                  <Sparkles className="h-6 w-6 text-primary absolute -top-2 -right-2 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-white">For Candidates</h2>
                <p className="text-white/70">
                  Discover opportunities that match your skills, values, and career goals.
                </p>
              </div>
            </SpaceCard>

            <SpaceCard className="cursor-pointer transition-transform hover:scale-105">
              <div 
                className="text-center space-y-4"
                onClick={() => navigate("/vr/signup")}
              >
                <div className="flex justify-center relative">
                  <Link className="h-16 w-16 text-primary drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
                  <Sparkles className="h-6 w-6 text-primary absolute -top-2 -right-2 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-white">Become a Connector</h2>
                <p className="text-white/70">
                  Help match great talent with amazing opportunities and earn rewards.
                </p>
              </div>
            </SpaceCard>
          </div>

          <div className="text-center">
            <p className="text-white/70">
              Already have an account?{" "}
              <a href="/" className="text-primary hover:text-primary/80 font-medium drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
};

export default SignUp;
