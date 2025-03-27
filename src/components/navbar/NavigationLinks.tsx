
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, Home, UserPlus, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const NavigationLinks = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-4">
      <nav className="flex items-center space-x-6">
        <Link 
          to="/" 
          className="text-black hover:text-black/80 flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link 
          to="/jobs" 
          className="text-black hover:text-black/80 flex items-center gap-2"
        >
          <Briefcase className="h-4 w-4" />
          <span>Job Board</span>
        </Link>
      </nav>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
            >
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
            <Button 
              className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
            >
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
    </div>
  );
};

export default NavigationLinks;
