import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NegotiationCardProps {
  negotiation: {
    id: number;
    initial_commission: number;
    current_commission: number;
    status: string;
  };
  onRespond: (negotiationId: number, accepted: boolean) => void;
}

const NegotiationCard = ({ negotiation, onRespond }: NegotiationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Bonus Offer: {negotiation.current_commission}%
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Initial offer: {negotiation.initial_commission}%
          </p>
          <p className="text-sm text-muted-foreground">
            Status: {negotiation.status}
          </p>
          {negotiation.status === 'pending' && (
            <div className="flex space-x-2 mt-4">
              <Button
                variant="default"
                onClick={() => onRespond(negotiation.id, true)}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                onClick={() => onRespond(negotiation.id, false)}
              >
                Decline
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NegotiationCard;