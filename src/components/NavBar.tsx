import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import RecruiterNotifications from "./RecruiterNotifications";

const NavBar = () => {
  const { user, userType } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="jobz"
              />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/jobs"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Job Board
              </Link>
              {user && (
                <>
                  {userType === 'employer' && (
                    <Link
                      to="/employer/dashboard"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                  )}
                  {userType === 'recruiter' && (
                    <Link
                      to="/recruiter/dashboard"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!user ? (
              <div className="hidden sm:flex sm:space-x-4">
                <Link
                  to="/employer/signup"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Employer Sign Up
                </Link>
                <Link
                  to="/employer/signin"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Employer Sign In
                </Link>
                <Link
                  to="/candidate/signup"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Candidate Sign Up
                </Link>
                <Link
                  to="/candidate/signin"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Candidate Sign In
                </Link>
                <Link
                  to="/recruiter/signup"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  VR Sign Up
                </Link>
                <Link
                  to="/recruiter/signin"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  VR Sign In
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {userType === 'recruiter' && <RecruiterNotifications />}
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;