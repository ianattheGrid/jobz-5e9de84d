
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, BarChart3 } from "lucide-react";

interface DashboardStatsProps {
  totalReferrals: number;
  successfulPlacements: number;
  pendingRecommendations: number;
}

export const DashboardStats = ({ 
  totalReferrals, 
  successfulPlacements, 
  pendingRecommendations 
}: DashboardStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-muted-foreground mb-1">Total Referrals</h3>
              <p className="text-3xl font-bold">{totalReferrals}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-red-800" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-muted-foreground mb-1">Successful Placements</h3>
              <p className="text-3xl font-bold">{successfulPlacements}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-muted-foreground mb-1">Pending Recommendations</h3>
              <p className="text-3xl font-bold">{pendingRecommendations}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
