import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Logo from "./navbar/Logo";
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
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileNav />
            <Logo />
          </div>
          <NavigationLinks />
        </div>
      </div>
    </div>
  );
};

export default NavBar;