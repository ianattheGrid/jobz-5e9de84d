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
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent>
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
          {!user ? (
            <>
              <Link to="/employer/signin" className="text-lg hover:text-gray-900">
                Employer Sign In
              </Link>
              <Link to="/candidate/signin" className="text-lg hover:text-gray-900">
                Candidate Sign In
              </Link>
              <Link to="/vr/signin" className="text-lg hover:text-gray-900">
                Virtual Recruiter Sign In
              </Link>
            </>
          ) : (
            <>
              {userType === "employer" && (
                <Link
                  to="/employer/dashboard"
                  className="text-lg hover:text-gray-900"
                >
                  Employer Dashboard
                </Link>
              )}
              {userType === "candidate" && (
                <Link
                  to="/candidate/dashboard"
                  className="text-lg hover:text-gray-900"
                >
                  Candidate Dashboard
                </Link>
              )}
              {userType === "recruiter" && (
                <Link to="/vr/dashboard" className="text-lg hover:text-gray-900">
                  Virtual Recruiter Dashboard
                </Link>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;