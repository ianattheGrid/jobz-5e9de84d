import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const NavigationLinks = () => {
  const { user, userType } = useAuth();

  return (
    <nav className="flex items-center space-x-4">
      <Link to="/calculator" className="text-white hover:text-white/80">
        Calculator
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
      ) : userType === 'employer' ? (
        <Link to="/employer/dashboard" className="text-white hover:text-white/80">
          Dashboard
        </Link>
      ) : null}
    </nav>
  );
};

export default NavigationLinks;