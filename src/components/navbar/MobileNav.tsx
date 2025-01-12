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
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <Menu className="h-6 w-6 text-primary" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col space-y-4">
          <Link to="/" className="text-lg text-gray-600 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/jobs" className="text-lg text-gray-600 hover:text-primary transition-colors">
            Job Board
          </Link>
          <SheetClose asChild>
            <button 
              onClick={() => {
                setTimeout(() => {
                  window.location.href = '/#calculator-section';
                  const element = document.getElementById('calculator-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="text-lg text-gray-600 hover:text-primary transition-colors text-left"
            >
              Calculator
            </button>
          </SheetClose>

          {isAuthenticated && userType === 'employer' && (
            <>
              <div className="h-px bg-gray-200 my-2" />
              <Link to="/employer/dashboard" className="text-lg text-gray-600 hover:text-primary transition-colors">
                Dashboard
              </Link>
            </>
          )}

          {isAuthenticated && userType === 'candidate' && (
            <>
              <div className="h-px bg-gray-200 my-2" />
              <Link to="/candidate/dashboard" className="text-lg text-gray-600 hover:text-primary transition-colors">
                Dashboard
              </Link>
            </>
          )}
          
          <div className="h-px bg-gray-200 my-4" />
          <SheetClose asChild>
            <button 
              onClick={() => {
                setTimeout(() => {
                  const element = document.getElementById('signup-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="text-lg text-orange-500 font-semibold hover:text-orange-600 transition-colors text-left"
            >
              Sign in / Sign up
            </button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;