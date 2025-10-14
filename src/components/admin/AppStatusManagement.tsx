import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AppStatus {
  status: 'soft_launch' | 'live';
  launch_location: string;
  is_free_in_launch_location: boolean;
  go_live_date?: string;
}

interface AppStatusManagementProps {
  currentStatus: AppStatus;
  totalUsers: number;
  onStatusChange: () => void;
}

export const AppStatusManagement = ({ currentStatus, totalUsers, onStatusChange }: AppStatusManagementProps) => {
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isGoingLive, setIsGoingLive] = useState(false);

  const handleGoLive = async () => {
    setIsGoingLive(true);
    try {
      const goLiveDate = new Date().toISOString();

      // Update app status
      const { error: updateError } = await supabase
        .from('app_settings')
        .update({
          status: 'live',
          go_live_date: goLiveDate,
          soft_launch_end_date: goLiveDate,
        })
        .eq('app_name', 'localz');

      if (updateError) throw updateError;

      // Trigger notification edge function
      const { data, error: functionError } = await supabase.functions.invoke('notify-go-live', {
        body: { go_live_date: goLiveDate },
      });

      if (functionError) {
        console.error('Error sending notifications:', functionError);
        toast({
          title: "Status Updated",
          description: "App is now LIVE, but there was an issue sending notifications.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "🎉 App is now LIVE!",
          description: `Successfully notified ${data.notified} users (${data.candidates} candidates, ${data.employers} employers)`,
        });
      }

      onStatusChange();
      setShowConfirmDialog(false);
    } catch (error: any) {
      console.error('Error going live:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update app status",
        variant: "destructive",
      });
    } finally {
      setIsGoingLive(false);
    }
  };

  const isLive = currentStatus.status === 'live';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            App Status Management
          </CardTitle>
          <CardDescription>
            Manage the launch status and notify users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Status</p>
              <Badge variant={isLive ? "default" : "secondary"} className="text-base">
                {isLive ? "🎉 LIVE" : "🚀 Soft Launch"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-base font-medium">{currentStatus.launch_location}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Free Access</p>
              <Badge variant={currentStatus.is_free_in_launch_location ? "default" : "outline"}>
                {currentStatus.is_free_in_launch_location ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          {currentStatus.go_live_date && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Went Live</p>
              <p className="text-base">{new Date(currentStatus.go_live_date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          )}

          {!isLive && (
            <div className="pt-4 border-t">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg mb-4">
                <AlertCircle className="h-5 w-5 text-brand-pink mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Ready to Launch?</p>
                  <p className="text-sm text-muted-foreground">
                    This will change the app status to LIVE and send notifications to all {totalUsers} soft launch users.
                  </p>
                </div>
              </div>
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => setShowConfirmDialog(true)}
                disabled={isGoingLive}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Go Live Now
              </Button>
            </div>
          )}

          {isLive && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                ✅ App is currently LIVE in {currentStatus.launch_location}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🚀 Go Live with localz?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>This action will:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Change app status from Soft Launch to LIVE</li>
                <li>Remove the soft launch banner from the website</li>
                <li>Send notifications to all {totalUsers} soft launch users</li>
                <li>Make all profiles publicly searchable</li>
              </ul>
              <p className="font-medium">Are you ready to launch?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isGoingLive}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGoLive} disabled={isGoingLive}>
              {isGoingLive ? "Launching..." : "Yes, Go Live!"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
