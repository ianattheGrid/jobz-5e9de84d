
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BonusPaymentModal } from "../../BonusPaymentModal";

interface EmployerNegotiationCardProps {
  negotiation: {
    id: number;
    job_id: number;
    initial_commission: number;
    current_commission: number;
    status: string;
    application_id?: number;
  };
  onUpdateOffer: (negotiationId: number, newAmount: number) => void;
}

const EmployerNegotiationCard = ({ negotiation, onUpdateOffer }: EmployerNegotiationCardProps) => {
  const [newBonus, setNewBonus] = useState<string>("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

          {negotiation.status !== 'accepted' ? (
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
          ) : negotiation.application_id ? (
            <div className="pt-2">
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => setShowPaymentModal(true)}
              >
                Confirm Hire & Start Date
              </Button>
              
              {showPaymentModal && negotiation.application_id && (
                <BonusPaymentModal 
                  applicationId={negotiation.application_id}
                  isOpen={showPaymentModal}
                  onClose={() => setShowPaymentModal(false)}
                />
              )}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployerNegotiationCard;
