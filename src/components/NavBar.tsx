import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Logo from "./navbar/Logo";
import NavigationLinks from "./navbar/NavigationLinks";
import AuthMenu from "./navbar/AuthMenu";

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
            <Logo />
            <NavigationLinks isAuthenticated={isAuthenticated} userType={userType} />
          </div>
          <div className="flex space-x-4">
            <AuthMenu isAuthenticated={isAuthenticated} handleSignOut={handleSignOut} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;