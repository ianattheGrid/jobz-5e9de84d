import { Link } from "react-router-dom";
import { Building2, User, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Welcome to jobz
        </h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Employer Card */}
          <Link 
            to="/employer/signup" 
            className="flex flex-col items-center p-8 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <Building2 className="w-16 h-16 text-primary-DEFAULT mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Employer</h2>
            <p className="text-gray-600 text-center">Post jobs and find the perfect candidates</p>
          </Link>

          {/* Candidate Card */}
          <Link 
            to="/candidate/signup" 
            className="flex flex-col items-center p-8 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <User className="w-16 h-16 text-primary-DEFAULT mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Candidate</h2>
            <p className="text-gray-600 text-center">Find your dream job and earn bonuses</p>
          </Link>

          {/* Virtual Recruiter Card */}
          <Link 
            to="/recruiter/signup" 
            className="flex flex-col items-center p-8 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <Users className="w-16 h-16 text-primary-DEFAULT mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Virtual Recruiter</h2>
            <p className="text-gray-600 text-center">Earn commissions by matching talent with opportunities</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;