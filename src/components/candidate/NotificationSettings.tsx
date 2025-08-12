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
    // Start with notifications disabled by default
    setIsEnabled(false);
  }, []);

  const handleToggleNotifications = () => {
    setIsLoading(true);
    
    // Simple toggle - no browser permission checking
    setTimeout(() => {
      setIsEnabled(!isEnabled);
      setIsLoading(false);
      
      toast({
        title: !isEnabled ? "Notifications enabled!" : "Notifications disabled",
        description: !isEnabled ? "You'll receive job alerts" : "Job alerts turned off",
      });
    }, 500);
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
                  disabled={isLoading}
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