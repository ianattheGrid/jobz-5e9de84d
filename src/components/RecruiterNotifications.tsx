import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  job_id: number;
  is_read: boolean;
  created_at: string;
  jobs: {
    title: string;
    company: string;
    candidate_commission: number;
  };
}

const RecruiterNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
    subscribeToNotifications();
  }, []);

  const loadNotifications = async () => {
    const { data, error } = await supabase
      .from("recruiter_notifications")
      .select(`
        *,
        jobs (
          title,
          company,
          candidate_commission
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load notifications",
      });
      return;
    }

    setNotifications(data || []);
    setUnreadCount(data?.filter(n => !n.is_read).length || 0);
  };

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('job_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'recruiter_notifications',
        },
        (payload) => {
          loadNotifications();
          toast({
            title: "New Job Alert",
            description: "A new job with commission is available!",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (notificationId: number) => {
    const { error } = await supabase
      .from("recruiter_notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark notification as read",
      });
      return;
    }

    loadNotifications();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${
                    notification.is_read ? "bg-muted/50" : "bg-muted"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <p className="text-sm font-medium">
                    New Job: {notification.jobs.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.jobs.company} - Commission: £
                    {notification.jobs.candidate_commission}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RecruiterNotifications;