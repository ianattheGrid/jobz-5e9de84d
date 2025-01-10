import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Logo from "./navbar/Logo";
import MobileNav from "./navbar/MobileNav";
import { Button } from "./ui/button";

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="block lg:hidden">
              <MobileNav />
            </div>
            <Logo />
            <div className="hidden lg:flex items-center gap-6">
              <Link 
                to="/jobs" 
                className="text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                Job Board
              </Link>
              <Link 
                to="/#calculator" 
                className="text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                Fee Calculator
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/employer/signin">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 font-semibold">
                    Employer Sign In
                  </Button>
                </Link>
                <Link to="/candidate/signin">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 font-semibold">
                    Candidate Sign In
                  </Button>
                </Link>
                <Link to="/vr/signin">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 font-semibold">
                    Virtual Recruiter Sign In
                  </Button>
                </Link>
                <Link to="/employer/signup">
                  <Button variant="default" className="bg-primary hover:bg-primary/90">
                    Start Hiring
                  </Button>
                </Link>
              </>
            ) : (
              <Link to={`/${userType}/dashboard`}>
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;