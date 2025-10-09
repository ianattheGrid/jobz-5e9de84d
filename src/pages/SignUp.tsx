import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Briefcase, User, Users } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-16 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Join <span className="text-primary [&]:!text-primary">Jobz</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Select your account type to get started
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.title}
                  onClick={() => navigate(role.path)}
                  className="group p-8 bg-card border border-border rounded-lg hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-primary [&]:!text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary [&]:!text-primary transition-colors">
                    {role.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {role.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-primary [&]:!text-primary hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
