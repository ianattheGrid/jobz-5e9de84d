
import { BellDot, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";

export const NotificationsPopover = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <>
              <BellDot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <ScrollArea className="h-80">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Notifications</h4>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No notifications yet</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.is_read ? 'bg-gray-50' : 'bg-blue-50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <h5 className="font-medium text-sm">{notification.title}</h5>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
