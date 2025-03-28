
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardLoading = () => {
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Virtual Recruiter Dashboard</CardTitle>
          <CardDescription>Loading your dashboard...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF69B4]"></div>
        </CardContent>
      </Card>
    </div>
  );
};
