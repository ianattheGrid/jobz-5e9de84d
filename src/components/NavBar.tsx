
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MobileNav from "./navbar/MobileNav";
import NavigationLinks from "./navbar/NavigationLinks";

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session?.user.user_metadata.user_type) {
        setUserType(session.user.user_metadata.user_type);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user.user_metadata.user_type) {
        setUserType(session.user.user_metadata.user_type);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16">
      <div className="container mx-auto px-4 h-full">
        <div className="grid grid-cols-3 items-center h-full">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white mr-20">
              jobz
            </Link>
            <div className="hidden md:block">
              <NavigationLinks />
            </div>
          </div>
          
          <div className="col-span-1 flex justify-center">
            {/* Center content if needed */}
          </div>
          
          <div className="flex justify-end">
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
            <MobileNav isAuthenticated={isAuthenticated} userType={userType} />
          </div>
        </div>
      </div>
    </header>
  );
};

import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default NavBar;
