export const formatSalary = (amount: number) => `£${amount.toLocaleString()}`;

export const formatBenefits = (benefits: string | null) => {
  if (!benefits) return [];
  return benefits.split(',').map(benefit => benefit.trim());
};