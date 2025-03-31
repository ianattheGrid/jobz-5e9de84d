
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const CompletedPayment = () => {
  return (
    <Card className="border-green-100">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <h3 className="text-lg font-medium">Bonus payment confirmed</h3>
          <p className="text-sm text-muted-foreground">
            We'll process the bonuses once payment is received.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
