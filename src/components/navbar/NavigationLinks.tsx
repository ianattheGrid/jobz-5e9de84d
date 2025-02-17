
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
  console.log('Current user state:', user);

  return (
    <div className="flex items-center gap-4">
      <nav className="flex items-center space-x-6">
        <Link 
          to="/" 
          className="text-white hover:text-white/80 flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link 
          to="/jobs" 
          className="text-white hover:text-white/80 flex items-center gap-2"
        >
          <Briefcase className="h-4 w-4" />
          <span>Jobs</span>
        </Link>
      </nav>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost"
              className="text-white hover:text-white/80"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white">
            <DropdownMenuItem asChild>
              <Link 
                to="/candidate/signin"
                className="w-full px-2 py-1.5 cursor-pointer"
              >
                Candidate Sign In
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/employer/signin"
                className="w-full px-2 py-1.5 cursor-pointer"
              >
                Employer Sign In
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/vr/signin"
                className="w-full px-2 py-1.5 cursor-pointer"
              >
                Virtual Recruiter Sign In
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white">
            <DropdownMenuItem asChild>
              <Link 
                to="/employer/signup"
                className="w-full px-2 py-1.5 cursor-pointer"
              >
                Employer
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/candidate/signup"
                className="w-full px-2 py-1.5 cursor-pointer"
              >
                Candidate
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/vr/signup"
                className="w-full px-2 py-1.5 cursor-pointer"
              >
                Virtual Recruiter
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NavigationLinks;
