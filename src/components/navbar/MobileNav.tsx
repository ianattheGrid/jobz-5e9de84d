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
  const { user, userType } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-white">
        <SheetHeader>
          <SheetTitle className="text-primary">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
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
              <Link to="/employer/signin" className="text-lg text-gray-600 hover:text-primary transition-colors">
                Employer Sign In
              </Link>
              <Link to="/candidate/signin" className="text-lg text-gray-600 hover:text-primary transition-colors">
                Candidate Sign In
              </Link>
              <Link to="/vr/signin" className="text-lg text-gray-600 hover:text-primary transition-colors">
                Virtual Recruiter Sign In
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;