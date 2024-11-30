export const calculateTotalCommission = (salary: string, feePercentage: number): number => {
  const numericSalary = parseFloat(salary.replace(/[^0-9.]/g, ''));
  return Math.round((numericSalary * (feePercentage / 100)) * 100) / 100;
};

export const calculateSplitCommissions = (
  totalCommission: number,
  candidatePercentage: number
): { candidateCommission: number; referralCommission: number } => {
  const candidateAmount = Math.round((totalCommission * (candidatePercentage / 100)) * 100) / 100;
  const referralAmount = Math.round((totalCommission * ((100 - candidatePercentage) / 100)) * 100) / 100;
  
  return {
    candidateCommission: candidateAmount,
    referralCommission: referralAmount
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount);
};