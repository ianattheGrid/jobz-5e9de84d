import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MobileNav from "./navbar/MobileNav";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Home as HomeIcon, Briefcase, LogOut, User, HelpCircle, QrCode, PoundSterling, Bell, Mail, Heart, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useWebPushNotifications } from "@/hooks/useWebPushNotifications";
import { DeleteAccountDialog } from "./shared/DeleteAccountDialog";

const NavBar = () => {
  const { user, userType, loading } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    console.log('NavBar user data:', {
      email: user?.email,
      full_name: user?.user_metadata?.full_name,
      userType: userType
    });
    
    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name);
    }
  }, [user, userType]);

  const { enableNotifications } = useWebPushNotifications();
  const showEnable = typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted';

  // Check if this is a test account
  const isTestAccount = user?.email?.includes('test.employer') || 
                       user?.email?.includes('test.candidate') || 
                       user?.email?.includes('test.vr') ||
                       user?.user_metadata?.full_name === 'Test Employer';

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Clear any local storage/session storage that might contain auth tokens
      localStorage.clear();
      sessionStorage.clear();
      
      // Force sign out with scope 'local' to clear local session
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) {
        console.error('Sign out error:', error);
        // Even if there's an error, we should still clear local state and redirect
      } else {
        console.log('Successfully signed out');
      }
      
      // Force refresh to clear any cached state
      window.location.href = '/';
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, clear local state and redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  const navLinks = [
    { to: "/", label: "Home", Icon: HomeIcon },
    { to: "/jobs", label: "Job Board", Icon: Briefcase },
    { to: "/pricing", label: "Pricing", Icon: PoundSterling },
    { to: "/qr-code", label: "GetApp", Icon: QrCode },
    { to: "/faq", label: "FAQ", Icon: HelpCircle },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-background/80 backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-display font-bold tracking-tight text-foreground">
                Jobz
              </span>
            </Link>
            <div className="hidden lg:block">
              <nav className="flex items-center space-x-7">
                {navLinks.map(({ to, label, Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="flex items-center">
            {!loading && user && !isTestAccount ? (
              <div className="hidden lg:flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <User className="h-4 w-4 mr-2" />
                      {userName || userType || 'Account'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    {userType && (
                      <Link 
                        to={`/${userType}/dashboard`}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-white/5 hover:text-foreground"
                      >
                        Dashboard
                      </Link>
                    )}
                    {userType && (
                      <Link 
                        to={`/${userType}/profile`}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-white/5 hover:text-foreground"
                      >
                        Profile
                      </Link>
                    )}
                    <div className="h-px bg-border my-1" />
                    <Link 
                      to="/contact"
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Us
                    </Link>
                    <a 
                      href="https://dgrid.co/contribute" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Contribute
                    </a>
                    <div className="h-px bg-border my-1" />
                    <DeleteAccountDialog>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </DropdownMenuItem>
                    </DeleteAccountDialog>
                    <div className="h-px bg-border my-1" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm text-foreground/80 hover:text-foreground"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="py-1">
                      <Link 
                        to="/candidate/signin"
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-white/5 hover:text-foreground"
                      >
                        Candidate Sign In
                      </Link>
                      <Link 
                        to="/employer/signin"
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-white/5 hover:text-foreground"
                      >
                        Employer Sign In
                      </Link>
                      <Link 
                        to="/vr/signin"
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-white/5 hover:text-foreground"
                      >
                        Connector Sign In
                      </Link>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={() => navigate('/signup')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
            <MobileNav isAuthenticated={!!(user && !isTestAccount)} userType={userType} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
