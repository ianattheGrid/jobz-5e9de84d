import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthMenuProps {
  isAuthenticated: boolean;
  handleSignOut: () => Promise<void>;
}

const AuthMenu = ({ isAuthenticated, handleSignOut }: AuthMenuProps) => {
  if (isAuthenticated) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Sign In
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/candidate/signup">Candidate Sign Up</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/candidate/signin">Candidate Sign In</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/employer/signup">Employer Sign Up</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/employer/signin">Employer Sign In</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/recruiter/signup">Virtual Recruiter Sign Up</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/recruiter/signin">Virtual Recruiter Sign In</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthMenu;