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