import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, ChartBar } from "lucide-react";

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
  const statsCards = [
    {
      title: "Total Referrals",
      value: totalReferrals,
      icon: <Users className="h-6 w-6 text-red-800" />,
    },
    {
      title: "Successful Placements",
      value: successfulPlacements,
      icon: <UserCheck className="h-6 w-6 text-green-600" />,
    },
    {
      title: "Pending Recommendations",
      value: pendingRecommendations,
      icon: <ChartBar className="h-6 w-6 text-blue-600" />,
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      {statsCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};