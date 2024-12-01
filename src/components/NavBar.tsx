import { Building2, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Building2 className="h-8 w-8 text-red-800" />
              <span className="ml-2 text-xl font-semibold text-red-800">jobz</span>
            </Link>
          </div>

          <div className="hidden md:flex md:space-x-8">
            <Link to="/jobs" className="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-gray-900">
              Job Board
            </Link>
            <Link to="/candidates" className="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-gray-900">
              Post a vacancy
            </Link>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/employer/signup">Employer Sign Up</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/employer/signin">Employer Sign In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/candidates">Post a Vacancy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/jobs">Job Board</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/recruiter/signup">Virtual Recruiter Sign Up</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/recruiter/signin">Virtual Recruiter Sign In</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;