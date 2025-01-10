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

  const scrollToSignUp = (setOpen: (open: boolean) => void) => {
    setOpen(false); // Close the sheet first
    setTimeout(() => {
      // Small delay to ensure smooth transition
      const element = document.getElementById('signup-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

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
          <Link to="/calculator" className="text-lg text-gray-600 hover:text-primary transition-colors">
            Calculator
          </Link>
          <Link to="/jobs" className="text-lg text-gray-600 hover:text-primary transition-colors">
            Job Board
          </Link>
          
          <div className="h-px bg-gray-200 my-4" />
          <button 
            onClick={() => {
              const element = document.getElementById('signup-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-lg text-orange-500 font-semibold hover:text-orange-600 transition-colors text-left"
          >
            Sign in / Sign up
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;