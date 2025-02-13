
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, Home } from "lucide-react";

const NavigationLinks = () => {
  const { user, userType } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link 
        to="/" 
        className="text-white hover:text-white/80 flex items-center gap-2"
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>
      <Link 
        to="/jobs" 
        className="text-white hover:text-white/80 flex items-center gap-2"
      >
        <Briefcase className="h-4 w-4" />
        <span>Jobs</span>
      </Link>
      
      {!user && (
        <>
          <Link 
            to="/employer/signup" 
            className="text-white hover:text-white/80"
          >
            Employer Sign Up
          </Link>
          <Link 
            to="/employer/signin" 
            className="text-white hover:text-white/80"
          >
            Employer Sign In
          </Link>
          <Link 
            to="/candidate/signup" 
            className="text-white hover:text-white/80"
          >
            Candidate Sign Up
          </Link>
          <Link 
            to="/candidate/signin" 
            className="text-white hover:text-white/80"
          >
            Candidate Sign In
          </Link>
          <Link 
            to="/vr/signup" 
            className="text-white hover:text-white/80"
          >
            Virtual Recruiter Sign Up
          </Link>
          <Link 
            to="/vr/signin" 
            className="text-white hover:text-white/80"
          >
            Virtual Recruiter Sign In
          </Link>
        </>
      )}
    </nav>
  );
};

export default NavigationLinks;
