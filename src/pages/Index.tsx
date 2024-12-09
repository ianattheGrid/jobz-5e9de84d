import { Link } from "react-router-dom";
import { Building2, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Welcome to jobz
        </h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Employer Card */}
          <div className="flex flex-col items-center p-8 rounded-lg bg-white shadow-lg">
            <Building2 className="w-16 h-16 text-primary-DEFAULT mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Employer</h2>
            <p className="text-gray-600 text-center mb-4">Post jobs and find the perfect candidates</p>
            <div className="flex flex-col gap-2 w-full">
              <Button asChild variant="outline" className="w-full">
                <Link to="/employer/signup">Sign Up</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/employer/signin">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Candidate Card */}
          <div className="flex flex-col items-center p-8 rounded-lg bg-white shadow-lg">
            <User className="w-16 h-16 text-primary-DEFAULT mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Candidate</h2>
            <p className="text-gray-600 text-center mb-4">Find your dream job and earn bonuses</p>
            <div className="flex flex-col gap-2 w-full">
              <Button asChild variant="outline" className="w-full">
                <Link to="/candidate/signup">Sign Up</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/candidate/signin">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Virtual Recruiter Card */}
          <div className="flex flex-col items-center p-8 rounded-lg bg-white shadow-lg">
            <Users className="w-16 h-16 text-primary-DEFAULT mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Virtual Recruiter</h2>
            <p className="text-gray-600 text-center mb-4">Earn commission by matching talent</p>
            <div className="flex flex-col gap-2 w-full">
              <Button asChild variant="outline" className="w-full">
                <Link to="/recruiter/signup">Sign Up</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/recruiter/signin">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;