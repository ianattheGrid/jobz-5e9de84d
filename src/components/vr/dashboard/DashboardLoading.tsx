
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const DashboardLoading = () => {
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Connector Dashboard</CardTitle>
          <CardDescription>Loading your dashboard...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-gray-600">Please wait while we load your data...</p>
        </CardContent>
      </Card>
    </div>
  );
};
