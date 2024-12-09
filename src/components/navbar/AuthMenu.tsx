import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      {!isAuthenticated ? (
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
      ) : (
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSignOut}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default AuthMenu;