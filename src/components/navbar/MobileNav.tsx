
import { Link } from "react-router-dom";
import { Menu, LogOut, Mail, Heart, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { DeleteAccountDialog } from "../shared/DeleteAccountDialog";

interface MobileNavProps {
  isAuthenticated: boolean;
  userType: string | null;
}

const MobileNav = ({ isAuthenticated, userType }: MobileNavProps) => {
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-accent rounded-md lg:hidden">
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
          <Link to="/qr-code" className="text-lg text-muted-foreground hover:text-primary transition-colors">
            GetApp
          </Link>

          {!isAuthenticated ? (
            <>
              <div className="h-px bg-border my-2" />
              <Link to="/employer/signin" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                Employer Sign In
              </Link>
              <Link to="/candidate/signin" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                Candidate Sign In
              </Link>
              <Link to="/vr/signin" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                Connector Sign In
              </Link>
              <div className="h-px bg-border my-2" />
              <Link to="/signup" className="text-lg text-primary [&]:!text-primary hover:text-primary/80 transition-colors font-medium">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="h-px bg-border my-2" />
              {userType && (
                <Link to={`/${userType}/dashboard`} className="text-lg text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              )}
              {userType && (
                <Link to={`/${userType}/profile`} className="text-lg text-muted-foreground hover:text-primary transition-colors">
                  Profile
                </Link>
              )}
              {userType === 'employer' && (
                <Link to="/employer/manage-jobs" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                  Manage Jobs
                </Link>
              )}
              {userType === 'candidate' && (
                <Link to="/candidate/applications" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                  My Applications
                </Link>
              )}
              {userType === 'vr' && (
                <Link to="/vr/recommendations" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                  Recommendations
                </Link>
              )}
              <div className="h-px bg-border my-2" />
              <Link to="/contact" className="text-lg text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Us
              </Link>
              <a 
                href="https://dgrid.co/contribute" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lg text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Heart className="h-5 w-5" />
                Contribute
              </a>
              <div className="h-px bg-border my-2" />
              <DeleteAccountDialog>
                <button className="text-lg text-destructive hover:text-destructive/80 transition-colors flex items-center gap-2 w-full text-left">
                  <Trash2 className="h-5 w-5" />
                  Delete Account
                </button>
              </DeleteAccountDialog>
              <div className="h-px bg-border my-2" />
              <button 
                onClick={handleSignOut}
                className="text-lg text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
