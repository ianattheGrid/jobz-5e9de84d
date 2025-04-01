
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000; 
// Warning before timeout (1 minute before expiry)
const WARNING_BEFORE_TIMEOUT = 60 * 1000;

export const SessionTimeoutHandler = () => {
  const { user } = useAuth();
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const { toast } = useToast();
  const navigate = useNavigate();

  // Reset the timer whenever there's user activity
  const resetActivityTimer = () => {
    setLastActivity(Date.now());
    setShowTimeoutWarning(false);
  };

  // Set up activity listeners
  useEffect(() => {
    if (!user) return;

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      resetActivityTimer();
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [user]);

  // Check for session timeout
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivity;

      // Show warning before timeout
      if (timeSinceLastActivity >= SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT && 
          timeSinceLastActivity < SESSION_TIMEOUT && 
          !showTimeoutWarning) {
        setShowTimeoutWarning(true);
      }

      // Sign out when session times out
      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        clearInterval(intervalId);
        handleSessionTimeout();
      }
    }, 10000); // Check every 10 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [user, lastActivity, showTimeoutWarning]);

  const handleSessionTimeout = async () => {
    setShowTimeoutWarning(false);
    
    try {
      await supabase.auth.signOut();
      toast({
        title: "Session expired",
        description: "Your session has expired. Please sign in again.",
      });
      
      // Determine which signin page to redirect to based on userType
      const userType = user?.user_metadata?.user_type || 'vr';
      navigate(`/${userType}/signin`);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const extendSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        resetActivityTimer();
        toast({
          title: "Session extended",
          description: "Your session has been extended.",
        });
      }
    } catch (error) {
      console.error("Error extending session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to extend your session. Please sign in again.",
      });
      handleSessionTimeout();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Dialog open={showTimeoutWarning} onOpenChange={setShowTimeoutWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your session is about to expire</DialogTitle>
            <DialogDescription>
              Due to inactivity, your session will expire soon. Would you like to stay signed in?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between">
            <Button
              variant="outline"
              onClick={handleSessionTimeout}
            >
              Sign Out
            </Button>
            <Button
              className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
              onClick={extendSession}
            >
              Stay Signed In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
