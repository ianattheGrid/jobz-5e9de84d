import { formatSalary } from "../utils";

interface CommissionDetailsProps {
  candidateCommission: number;
}

const CommissionDetails = ({ candidateCommission }: CommissionDetailsProps) => {
  const calculateReferralCommission = (totalCommission: number) => {
    return Math.floor(totalCommission * 0.3);
  };

  return (
    <div className="mb-4 p-3 bg-red-50 rounded-md">
      <p className="text-sm font-medium text-red-700 mb-2">
        "You're Hired" Bonus Details
      </p>
      <div className="text-sm text-red-600 space-y-1">
        <p>Total Bonus: {formatSalary(candidateCommission)}</p>
        <div className="text-xs space-y-0.5">
          <p>• Candidate: {formatSalary(candidateCommission - calculateReferralCommission(candidateCommission))}</p>
          <p>• Referral: {formatSalary(calculateReferralCommission(candidateCommission))}</p>
        </div>
      </div>
    </div>
  );
};

export default CommissionDetails;