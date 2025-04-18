import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User, Building2, Users } from "lucide-react";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

export const SignUpSection = () => {
  return (
    <section id="signup-section" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-12 ${PRIMARY_COLOR_PATTERN}`}>
          Get Started Today
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <UserTypeCard
            icon={User}
            title="Candidate"
            description="Find your perfect role and earn 'You're Hired' bonuses"
            signInPath="/candidate/signin"
            signUpPath="/candidate/signup"
          />
          <UserTypeCard
            icon={Building2}
            title="Employer"
            description="Save thousands on recruitment costs with our revolutionary sourcing platform"
            signInPath="/employer/signin"
            signUpPath="/employer/signup"
          />
          <UserTypeCard
            icon={Users}
            title="Virtual Recruiter"
            description="Create a flexible income stream from anywhere - perfect as your main or second income"
            signInPath="/vr/signin"
            signUpPath="/vr/signup"
          />
        </div>
      </div>
    </section>
  );
};

const UserTypeCard = ({
  icon: Icon,
  title,
  description,
  signInPath,
  signUpPath,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  signInPath: string;
  signUpPath: string;
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Icon className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className={PRIMARY_COLOR_PATTERN}>{title}</CardTitle>
        <CardDescription className="text-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link 
          to={signInPath}
          className="block w-full bg-primary text-white text-center py-2 rounded hover:bg-primary/90 transition-colors"
        >
          Sign In
        </Link>
        <Link 
          to={signUpPath}
          className="block w-full border border-primary text-primary text-center py-2 rounded hover:bg-primary/5 transition-colors"
        >
          Sign Up
        </Link>
      </CardContent>
    </Card>
  );
};
