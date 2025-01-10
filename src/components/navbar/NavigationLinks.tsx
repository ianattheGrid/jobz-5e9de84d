import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const NavigationLinks = () => {
  const { user, userType } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-4">
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