
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
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem>
              <Link to="/candidate/signin" className="w-full">Candidate Sign In</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/employer/signin" className="w-full">Employer Sign In</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/vr/signin" className="w-full">Virtual Recruiter Sign In</Link>
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
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem>
              <Link to="/employer/signup" className="w-full">Employer</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/candidate/signup" className="w-full">Candidate</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/vr/signup" className="w-full">Virtual Recruiter</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NavigationLinks;
