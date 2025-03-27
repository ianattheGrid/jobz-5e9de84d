
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
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-white mr-4">
              jobz
            </Link>
            <NavigationLinks />
          </div>
          <MobileNav isAuthenticated={isAuthenticated} userType={userType} />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
