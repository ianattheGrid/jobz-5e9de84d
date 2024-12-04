import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import RecruiterNotifications from "./RecruiterNotifications";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const { user, userType } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-red-800">jobz.</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
                  <Menu className="h-6 w-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/jobs" className="w-full">
                    Job Board
                  </Link>
                </DropdownMenuItem>
                
                {!user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/employer/signup" className="w-full">
                        Employer Sign Up
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/employer/signin" className="w-full">
                        Employer Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/candidate/signup" className="w-full">
                        Candidate Sign Up
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/candidate/signin" className="w-full">
                        Candidate Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/recruiter/signup" className="w-full">
                        VR Sign Up
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/recruiter/signin" className="w-full">
                        VR Sign In
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    {userType === 'employer' && (
                      <DropdownMenuItem asChild>
                        <Link to="/employer/dashboard" className="w-full">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {userType === 'recruiter' && (
                      <DropdownMenuItem asChild>
                        <Link to="/recruiter/dashboard" className="w-full">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => supabase.auth.signOut()}
                        className="w-full text-left"
                      >
                        Sign Out
                      </button>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {user && userType === 'recruiter' && <RecruiterNotifications />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;