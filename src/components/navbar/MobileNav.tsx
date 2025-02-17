
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

interface MobileNavProps {
  isAuthenticated: boolean;
  userType: string | null;
}

const MobileNav = ({ isAuthenticated, userType }: MobileNavProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-accent rounded-md md:hidden">
          <Menu className="h-6 w-6 text-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:max-w-sm bg-background border-r border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col space-y-4">
          <Link to="/" className="text-lg text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/jobs" className="text-lg text-muted-foreground hover:text-primary transition-colors">
            Job Board
          </Link>

          {!isAuthenticated && (
            <>
              <div className="h-px bg-border my-2" />
              <Link to="/employer/signin" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                Employer Sign In
              </Link>
              <Link to="/candidate/signin" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                Candidate Sign In
              </Link>
              <Link to="/vr/signin" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                Virtual Recruiter Sign In
              </Link>
              <div className="h-px bg-border my-2" />
              <Link to="/employer/signup" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                Employer Sign Up
              </Link>
              <Link to="/candidate/signup" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                Candidate Sign Up
              </Link>
              <Link to="/vr/signup" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                Virtual Recruiter Sign Up
              </Link>
            </>
          )}

          {isAuthenticated && userType === 'employer' && (
            <>
              <div className="h-px bg-border my-2" />
              <Link to="/employer/dashboard" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            </>
          )}

          {isAuthenticated && userType === 'candidate' && (
            <>
              <div className="h-px bg-border my-2" />
              <Link to="/candidate/dashboard" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
