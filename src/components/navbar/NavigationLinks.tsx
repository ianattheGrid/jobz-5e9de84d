
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  console.log('Current user state:', user);

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path); // Debug log
    navigate(path);
  };

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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleNavigation("/candidate/signin")}>
              Candidate Sign In
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation("/employer/signin")}>
              Employer Sign In
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation("/vr/signin")}>
              Virtual Recruiter Sign In
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleNavigation("/employer/signup")}>
              Employer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation("/candidate/signup")}>
              Candidate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation("/vr/signup")}>
              Virtual Recruiter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NavigationLinks;
