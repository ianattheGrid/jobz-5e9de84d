
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface DashboardErrorProps {
  error: string;
}

export const DashboardError = ({ error }: DashboardErrorProps) => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/vr/signin');
  };
  
  return (
    <div className="container mx-auto py-8">
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Connector Dashboard</CardTitle>
          <CardDescription>We encountered an issue with your account</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Please try the following:</p>
          <ol className="list-decimal pl-5 space-y-2 mb-6">
            <li>Refresh the page and try again</li>
            <li>Sign out and sign back in</li>
            <li>Contact support if the issue persists</li>
          </ol>
          <div className="flex space-x-4">
            <Button 
              onClick={handleSignOut} 
              variant="outline"
            >
              Sign Out
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
            >
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
