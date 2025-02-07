
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase } from "lucide-react";

const NavigationLinks = () => {
  const { user, userType } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link 
        to="/jobs" 
        className="text-white hover:text-white/80 flex items-center gap-2"
      >
        <Briefcase className="h-4 w-4" />
        <span>Jobs</span>
      </Link>
      
      {!user ? (
        <>
          <Link to="/employer/signin" className="text-white hover:text-white/80">
            Employers
          </Link>
          <Link to="/candidate/signin" className="text-white hover:text-white/80">
            Candidates
          </Link>
          <Link to="/vr/signin" className="text-white hover:text-white/80">
            Virtual Recruiters
          </Link>
        </>
      ) : null}
    </nav>
  );
};

export default NavigationLinks;
