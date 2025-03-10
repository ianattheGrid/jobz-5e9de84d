
export const getTitlesForLegalSpecialisation = (specialisation: string): string[] => {
  switch (specialisation) {
    case "Corporate Law":
      return [
        "Corporate Lawyer",
        "Legal Counsel",
        "Corporate Legal Advisor",
        "In-house Counsel",
        "Legal Director"
      ];
    case "Employment Law":
      return [
        "Employment Lawyer",
        "Employment Law Specialist",
        "Labor Law Attorney",
        "HR Legal Counsel",
        "Workplace Law Advisor"
      ];
    case "Intellectual Property":
      return [
        "IP Lawyer",
        "Patent Attorney",
        "Trademark Lawyer",
        "IP Legal Counsel",
        "IP Rights Manager"
      ];
    case "Commercial Law":
      return [
        "Commercial Lawyer",
        "Business Law Specialist",
        "Contract Lawyer",
        "Commercial Legal Advisor",
        "Trade Law Specialist"
      ];
    case "Litigation":
      return [
        "Litigation Lawyer",
        "Trial Attorney",
        "Dispute Resolution Lawyer",
        "Court Advocate",
        "Legal Representative"
      ];
    case "Real Estate Law":
      return [
        "Real Estate Lawyer",
        "Property Law Specialist",
        "Real Estate Legal Counsel",
        "Land Law Attorney",
        "Property Rights Advisor"
      ];
    case "Tax Law":
      return [
        "Tax Lawyer",
        "Tax Law Specialist",
        "Tax Legal Advisor",
        "Tax Compliance Counsel",
        "International Tax Attorney"
      ];
    case "Regulatory Compliance":
      return [
        "Compliance Lawyer",
        "Regulatory Affairs Counsel",
        "Compliance Officer",
        "Legal Compliance Manager",
        "Regulatory Law Specialist"
      ];
    case "Contract Law":
      return [
        "Contract Lawyer",
        "Contract Law Specialist",
        "Commercial Contracts Counsel",
        "Contract Negotiator",
        "Legal Contract Manager"
      ];
    case "International Law":
      return [
        "International Lawyer",
        "Cross-border Legal Specialist",
        "International Trade Counsel",
        "Global Legal Advisor",
        "International Legal Affairs Manager"
      ];
    default:
      return [];
  }
};
