import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const NavBar = () => {
  const isMobile = useIsMobile();
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-DEFAULT" />
              <span className="ml-2 text-xl font-semibold text-gray-900">jobz</span>
            </Link>
          </div>

          <div className="hidden md:flex md:space-x-8">
            <Link to="/jobs" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-500">Vacancies</Link>
            <Link to="/candidates" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-500">Post a vacancy</Link>
          </div>

          <div className="flex items-center md:hidden">
            <Button variant="outline" className="hover:bg-gray-100">Menu</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;