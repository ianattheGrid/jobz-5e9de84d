import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from './NotificationBell';

const NavBar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    } else {
      navigate('/');
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    }
  };

  const renderAuthButtons = () => {
    if (!session) {
      return (
        <>
          <Link to="/candidate/signup">
            <Button variant="outline" className="mr-2">Candidate Sign Up</Button>
          </Link>
          <Link to="/employer/signup">
            <Button variant="outline" className="mr-2">Employer Sign Up</Button>
          </Link>
          <Link to="/vr/signup">
            <Button variant="outline">VR Sign Up</Button>
          </Link>
        </>
      );
    } else {
      return (
        <Button onClick={signOut}>Sign Out</Button>
      );
    }
  };

  const getDashboardLink = () => {
    if (!session) return "/";

    const userType = session.user?.user_metadata?.user_type;
    switch (userType) {
      case "candidate":
        return "/candidate/dashboard";
      case "employer":
        return "/employer/dashboard";
        case "vr":
          return "/vr/dashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to={getDashboardLink()} className="text-2xl font-bold text-primary">
            HireHub
          </Link>
          
          <div className="flex items-center gap-4">
            <NotificationBell />
            {renderAuthButtons()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
