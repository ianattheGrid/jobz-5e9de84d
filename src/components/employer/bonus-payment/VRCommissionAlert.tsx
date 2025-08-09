
import { Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface VRCommissionAlertProps {
  vrCommission: number;
}

export const VRCommissionAlert = ({ vrCommission }: VRCommissionAlertProps) => {
  return (
    <Alert variant="default" className="bg-amber-50 border-amber-200">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Connector Commission Notice</AlertTitle>
      <AlertDescription className="text-amber-700">
        This candidate was recommended by a Connector. A standard commission of 
        £{vrCommission.toLocaleString()} will apply as part of the bonus payment.
      </AlertDescription>
    </Alert>
  );
};
