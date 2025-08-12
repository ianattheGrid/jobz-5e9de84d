import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Bell, BellOff, Check, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const NotificationSettings = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are already enabled
    if ('Notification' in window) {
      setIsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleToggleNotifications = async () => {
    if (!('Notification' in window)) {
      toast({
        variant: "destructive",
        title: "Not supported",
        description: "This browser doesn't support notifications.",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isEnabled) {
        // User wants to disable - we can't actually revoke permission, but we can track their preference
        setIsEnabled(false);
        toast({
          title: "Notifications disabled",
          description: "You won't receive job alerts (you can re-enable anytime).",
        });
      } else {
        // User wants to enable
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          setIsEnabled(true);
          toast({
            title: "Notifications enabled!",
            description: "You'll now receive updates about new job matches and interview invites.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Notifications blocked",
            description: "Please allow notifications in your browser settings to receive job alerts.",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationStatus = () => {
    if (!('Notification' in window)) {
      return { text: "Not supported", variant: "secondary" as const, disabled: true };
    }
    
    if (isEnabled) {
      return { text: "Enabled", variant: "default" as const, disabled: true };
    } else {
      return { text: "Enable", variant: "default" as const, disabled: false };
    }
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <CardTitle>Push Notifications</CardTitle>
                {isEnabled && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            <CardDescription>
              Get instant alerts for new job matches and updates
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">Desktop Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive browser notifications even when the app is closed
                  </p>
                </div>
                
                <Button
                  onClick={handleToggleNotifications}
                  disabled={isLoading || !('Notification' in window)}
                  variant={isEnabled ? "outline" : "default"}
                  className={isEnabled ? "" : "bg-[#FF69B4] hover:bg-[#FF50A8] text-white"}
                >
                  {isLoading ? (
                    "Updating..."
                  ) : (
                    <>
                      <Bell className="w-4 h-4 mr-2" />
                      {isEnabled ? "Disable" : "Enable"}
                    </>
                  )}
                </Button>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-1">What you'll be notified about:</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• New jobs that match your profile</li>
                  <li>• Interview invitations and schedule changes</li>
                  <li>• Application status updates</li>
                  <li>• Messages from employers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};