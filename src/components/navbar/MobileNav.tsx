import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";

interface MobileNavProps {
  isAuthenticated: boolean;
  userType: string | null;
  handleSignOut: () => Promise<void>;
}

const MobileNav = ({ isAuthenticated, userType, handleSignOut }: MobileNavProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Link to="/" className="text-lg hover:text-gray-900">
            Home
          </Link>
          <Link to="/jobs" className="text-lg hover:text-gray-900">
            Job Board
          </Link>
          
          {isAuthenticated ? (
            <>
              {userType === 'employer' && (
                <Link to="/employer/dashboard" className="text-lg hover:text-gray-900">
                  Employer Dashboard
                </Link>
              )}
              {userType === 'candidate' && (
                <Link to="/candidate/dashboard" className="text-lg hover:text-gray-900">
                  Candidate Dashboard
                </Link>
              )}
              {userType === 'vr' && (
                <Link to="/vr/dashboard" className="text-lg hover:text-gray-900">
                  Virtual Recruiter Dashboard
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="text-lg text-red-600 hover:text-red-800 text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link 
                to="/employer/signin" 
                className="text-lg text-gray-600 hover:text-gray-900"
              >
                Employer Sign In
              </Link>
              <Link 
                to="/candidate/signin" 
                className="text-lg text-gray-600 hover:text-gray-900"
              >
                Candidate Sign In
              </Link>
              <Link 
                to="/vr/signin" 
                className="text-lg text-gray-600 hover:text-gray-900"
              >
                Virtual Recruiter Sign In
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;