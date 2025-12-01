import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Briefcase, User, Users, Sparkles } from "lucide-react";
import { CosmicBackground } from "@/components/ui/cosmic-background";
import { GlowCard } from "@/components/ui/glow-card";

const SignUp = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Employer",
      description: "Post jobs and find qualified candidates",
      icon: Briefcase,
      path: "/employer/signup",
      color: "from-primary/20 to-primary/5"
    },
    {
      title: "Candidate",
      description: "Find your next career opportunity",
      icon: User,
      path: "/candidate/signup",
      color: "from-primary/20 to-primary/5"
    },
    {
      title: "Connector",
      description: "Connect candidates with employers and earn",
      icon: Users,
      path: "/vr/signup",
      color: "from-primary/20 to-primary/5"
    }
  ];

  return (
    <CosmicBackground mode="light">
      <NavBar />
      <div className="container mx-auto px-4 py-16 pt-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Join <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Jobz</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your path and start your journey in the new generation of hiring
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <GlowCard
                  key={role.title}
                  className="group cursor-pointer p-8 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(role.path)}
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <Sparkles className="w-4 h-4 text-primary absolute top-0 right-1/3 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text group-hover:from-primary group-hover:to-accent transition-all duration-300">
                    {role.title}
                  </h2>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {role.description}
                  </p>
                </GlowCard>
              );
            })}
          </div>

          <div className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-primary hover:text-accent transition-colors font-medium hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </CosmicBackground>
  );
};

export default SignUp;
