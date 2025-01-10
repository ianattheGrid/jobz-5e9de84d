import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

const MobileNav = () => {
  const { user } = useAuth();

  return (
    <Sheet>
      <SheetTrigger className="flex items-center justify-center">
        <Menu className="h-6 w-6 text-white hover:text-gray-200 transition-colors" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-primary">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-4 flex flex-col gap-4">
          <Link to="/" className="text-lg text-gray-600 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/calculator" className="text-lg text-gray-600 hover:text-primary transition-colors">
            Calculator
          </Link>
          <Link to="/jobs" className="text-lg text-gray-600 hover:text-primary transition-colors">
            Job Board
          </Link>
          {!user && (
            <>
              <div className="h-px bg-gray-200 my-2" />
              <Link to="/employer/signup" className="text-lg text-gray-600 hover:text-primary transition-colors">
                Employer Sign Up
              </Link>
              <Link to="/employer/signin" className="text-lg text-gray-600 hover:text-primary transition-colors">
                Employer Sign In
              </Link>
              <Link to="/candidate/signup" className="text-lg text-gray-600 hover:text-primary transition-colors">
                Candidate Sign Up
              </Link>
              <Link to="/candidate/signin" className="text-lg text-gray-600 hover:text-primary transition-colors">
                Candidate Sign In
              </Link>
              <Link to="/vr/signup" className="text-lg text-gray-600 hover:text-primary transition-colors">
                Virtual Recruiter Sign Up
              </Link>
              <Link to="/vr/signin" className="text-lg text-gray-600 hover:text-primary transition-colors">
                Virtual Recruiter Sign In
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;