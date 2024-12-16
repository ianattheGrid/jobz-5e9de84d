import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import ApplicationList from "./notifications/ApplicationList";
import { useApplications } from "@/hooks/useApplications";

const ApplicationNotifications = () => {
  const { applications, unreadCount, handleAccept, handleReject } = useApplications();

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
          <h4 className="font-medium">Applications</h4>
          <ApplicationList 
            applications={applications}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ApplicationNotifications;