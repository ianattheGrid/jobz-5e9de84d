
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function RecommendationExpiryCard() {
  return (
    <Card className="mb-6 bg-amber-50 border-amber-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-800">Recommendation Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-amber-800 mt-0">
          <p className="mb-2">
            <strong>Recommendation Validity:</strong> All candidate recommendations are valid for 6 months from the submission date.
          </p>
          <p>
            <strong>Commission Eligibility:</strong> You will receive the agreed commission only if the candidate is hired within the 6-month validity period of your recommendation.
          </p>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
