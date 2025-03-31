
import { cn } from "@/lib/utils";

interface PaymentSummaryProps {
  candidateCommission: number;
  vrCommission?: number;
  className?: string;
}

export const PaymentSummary = ({ 
  candidateCommission, 
  vrCommission,
  className
}: PaymentSummaryProps) => {
  const totalAmount = candidateCommission + (vrCommission || 0);
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm font-medium">Payment Summary</div>
      <div className="rounded-md border p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Candidate Bonus:</span>
          <span className="font-medium">£{candidateCommission.toLocaleString()}</span>
        </div>
        {vrCommission && vrCommission > 0 && (
          <div className="flex justify-between text-sm">
            <span>Recruiter Bonus:</span>
            <span className="font-medium">£{vrCommission.toLocaleString()}</span>
          </div>
        )}
        <div className="border-t pt-2 mt-2 flex justify-between font-medium">
          <span>Total Due:</span>
          <span>£{totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
