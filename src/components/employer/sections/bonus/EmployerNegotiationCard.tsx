import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface EmployerNegotiationCardProps {
  negotiation: {
    id: number;
    job_id: number;
    initial_commission: number;
    current_commission: number;
    status: string;
  };
  onUpdateOffer: (negotiationId: number, newAmount: number) => void;
}

const EmployerNegotiationCard = ({ negotiation, onUpdateOffer }: EmployerNegotiationCardProps) => {
  const [newBonus, setNewBonus] = useState<string>("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Bonus Negotiation for Job #{negotiation.job_id}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Initial offer: {negotiation.initial_commission}%
            </p>
            <p className="text-sm text-muted-foreground">
              Current offer: {negotiation.current_commission}%
            </p>
            <p className="text-sm text-muted-foreground">
              Status: {negotiation.status}
            </p>
          </div>

          {negotiation.status !== 'accepted' && (
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="New bonus percentage"
                value={newBonus}
                onChange={(e) => setNewBonus(e.target.value)}
                className="w-40"
              />
              <Button
                variant="default"
                onClick={() => {
                  const amount = parseFloat(newBonus);
                  if (!isNaN(amount)) {
                    onUpdateOffer(negotiation.id, amount);
                    setNewBonus("");
                  }
                }}
              >
                Update Offer
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployerNegotiationCard;