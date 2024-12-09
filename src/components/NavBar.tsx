import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">jobz.</span>
            </Link>
          </div>
          
          <div className="flex space-x-4">
            {!isAuthenticated ? (
              <div className="space-x-2">
                <Link to="/candidate/signin">
                  <Button variant="outline">Candidate Sign In</Button>
                </Link>
                <Link to="/employer/signin">
                  <Button variant="outline">Employer Sign In</Button>
                </Link>
                <Link to="/recruiter/signin">
                  <Button variant="outline">Recruiter Sign In</Button>
                </Link>
              </div>
            ) : (
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;