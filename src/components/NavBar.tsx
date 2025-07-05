import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MobileNav from "./navbar/MobileNav";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Home as HomeIcon, Briefcase, LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const NavBar = () => {
  const { user, userType, loading } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name);
    }
  }, [user]);

  // Check if this is a test account
  const isTestAccount = user?.email?.includes('test.employer') || user?.user_metadata?.full_name === 'Test Employer';

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-background h-16" 
      style={{ 
        borderBottom: '2px solid #333333',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-2xl font-bold flex items-center">
              <span className="text-primary font-bold tracking-tight">jobz</span>
            </Link>
            <div className="hidden md:block">
              <nav className="flex items-center space-x-6">
                <Link 
                  to="/" 
                  className="text-black hover:text-black/80 flex items-center gap-2"
                >
                  <HomeIcon className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/jobs" 
                  className="text-black hover:text-black/80 flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Job Board</span>
                </Link>
              </nav>
            </div>
          </div>
          
          <div className="flex items-center">
            {!loading && user && !isTestAccount ? (
              <div className="hidden md:flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white">
                      <User className="h-4 w-4 mr-2" />
                      {userName || userType || 'Account'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white">
                    {userType && (
                      <Link 
                        to={`/${userType}/dashboard`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Dashboard
                      </Link>
                    )}
                    {userType && (
                      <Link 
                        to={`/${userType}/profile`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Profile
                      </Link>
                    )}
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white">
                    <div className="py-1">
                      <Link 
                        to="/candidate/signin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Candidate Sign In
                      </Link>
                      <Link 
                        to="/employer/signin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Employer Sign In
                      </Link>
                      <Link 
                        to="/vr/signin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Virtual Recruiter Sign In
                      </Link>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white">
                    <div className="py-1">
                      <Link 
                        to="/employer/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Employer
                      </Link>
                      <Link 
                        to="/candidate/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Candidate
                      </Link>
                      <Link 
                        to="/vr/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Virtual Recruiter
                      </Link>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <MobileNav isAuthenticated={!!(user && !isTestAccount)} userType={userType} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
