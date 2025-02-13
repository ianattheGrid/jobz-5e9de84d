
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
  const { user, userType } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-6">
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
      
      {!user && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-white hover:text-white/80 flex items-center gap-2 px-4 py-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white z-50">
              <DropdownMenuItem>
                <Link to="/employer/signup" className="w-full text-gray-900">Employer</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/candidate/signup" className="w-full text-gray-900">Candidate</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/vr/signup" className="w-full text-gray-900">Virtual Recruiter</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-white hover:text-white/80 flex items-center gap-2 px-4 py-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white z-50">
              <DropdownMenuItem>
                <Link to="/employer/signin" className="w-full text-gray-900">Employer</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/candidate/signin" className="w-full text-gray-900">Candidate</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/vr/signin" className="w-full text-gray-900">Virtual Recruiter</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </nav>
  );
};

export default NavigationLinks;
