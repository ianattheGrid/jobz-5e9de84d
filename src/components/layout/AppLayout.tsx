
import { Toaster } from "@/components/ui/toaster";
import { useWebPushNotifications } from "@/hooks/useWebPushNotifications";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  useWebPushNotifications(); // Initialize web push notifications

  return (
    <div className="min-h-screen bg-background">
      {children}
      <Toaster />
    </div>
  );
};
