import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import MobileNav from "./navbar/MobileNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

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
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-2 bg-white shadow-sm h-16">
      <div className="flex items-center">
        <MobileNav />
      </div>
      
      {!isAuthenticated && (
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-2">
                <UserCircle className="h-5 w-5" />
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Sign Up</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/employer/signup" className="w-full cursor-pointer">
                    Employer Sign Up
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/candidate/signup" className="w-full cursor-pointer">
                    Candidate Sign Up
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/vr/signup" className="w-full cursor-pointer">
                    Virtual Recruiter Sign Up
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Sign In</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/employer/signin" className="w-full cursor-pointer">
                    Employer Sign In
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/candidate/signin" className="w-full cursor-pointer">
                    Candidate Sign In
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/vr/signin" className="w-full cursor-pointer">
                    Virtual Recruiter Sign In
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  );
};

export default NavBar;