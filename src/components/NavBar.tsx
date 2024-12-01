import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import RecruiterNotifications from "./RecruiterNotifications";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
                alt="Logo"
              />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[200px]">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/jobs"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Jobs
                          </Link>
                        </NavigationMenuLink>
                        {user && (
                          <>
                            {userType === 'employer' && (
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/employer/dashboard"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Dashboard
                                </Link>
                              </NavigationMenuLink>
                            )}
                            {userType === 'recruiter' && (
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/recruiter/dashboard"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Dashboard
                                </Link>
                              </NavigationMenuLink>
                            )}
                          </>
                        )}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center">
            {!user ? (
              <div className="space-x-4">
                <Link
                  to="/employer/signin"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Employer Sign In
                </Link>
                <Link
                  to="/recruiter/signin"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Recruiter Sign In
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {userType === 'recruiter' && <RecruiterNotifications />}
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-gray-500 hover:text-gray-700"
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