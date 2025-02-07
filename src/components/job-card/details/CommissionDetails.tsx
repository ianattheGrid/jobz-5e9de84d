
import { Award } from "lucide-react";

interface CommissionDetailsProps {
  candidateCommission: number | null;
}

const CommissionDetails = ({ candidateCommission }: CommissionDetailsProps) => {
  const calculateReferralCommission = (totalCommission: number) => {
    return Math.floor(totalCommission * 0.3);
  };

  const formatSalary = (amount: number | null) => {
    if (!amount) return '£0';
    return `£${amount.toLocaleString()}`;
  };

  if (!candidateCommission) return null;

  return (
    <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
      <div className="flex items-center gap-2 mb-3">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold text-primary">
          "You're Hired" Bonus Details
        </h3>
      </div>
      <div className="space-y-2 text-sm">
        <p className="text-foreground font-medium">
          Total Bonus: {formatSalary(candidateCommission)}
        </p>
        <div className="pl-4 space-y-1 text-muted-foreground">
          <p>• Candidate: {formatSalary(candidateCommission - calculateReferralCommission(candidateCommission))}</p>
          <p>• Referral: {formatSalary(calculateReferralCommission(candidateCommission))}</p>
        </div>
      </div>
    </div>
  );
};

export default CommissionDetails;
