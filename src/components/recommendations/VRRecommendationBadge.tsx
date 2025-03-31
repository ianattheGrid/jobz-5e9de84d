
import { format } from "date-fns";
import { UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VRRecommendation } from "@/types/recommendations";

interface VRRecommendationBadgeProps {
  recommendation: VRRecommendation;
  className?: string;
}

export function VRRecommendationBadge({ recommendation, className = "" }: VRRecommendationBadgeProps) {
  // Get status display information
  const statusInfo = {
    pending: { color: "bg-blue-100 text-blue-800", label: "Pending" },
    matched: { color: "bg-green-100 text-green-800", label: "Matched" },
    interviewing: { color: "bg-purple-100 text-purple-800", label: "Interviewing" },
    offered: { color: "bg-amber-100 text-amber-800", label: "Offered" },
    hired: { color: "bg-emerald-100 text-emerald-800", label: "Hired" },
    rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
  };
  
  const status = recommendation.status || "pending";
  const { color, label } = statusInfo[status as keyof typeof statusInfo] || 
                            { color: "bg-gray-100 text-gray-800", label: status };
  
  return (
    <Card className={`border-l-4 border-l-pink-500 ${className}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCheck className="h-5 w-5 text-pink-500" />
          <div>
            <h3 className="font-medium text-gray-900">VR Recommended Candidate</h3>
            <p className="text-sm text-gray-600">
              Recommended by {recommendation.vr.name} ({recommendation.vr.vrNumber}) on {format(new Date(recommendation.recommendationDate), "dd MMM yyyy")}
            </p>
          </div>
        </div>
        <Badge className={color}>
          {label}
        </Badge>
      </CardContent>
    </Card>
  );
}
