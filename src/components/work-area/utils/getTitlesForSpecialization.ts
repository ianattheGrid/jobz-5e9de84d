import { itRoles } from "../constants/it-roles";
import { 
  customerSupportTitles,
  customerExperienceTitles,
  customerServiceManagementTitles,
  salesAndRetentionTitles,
  specializedCustomerServiceTitles,
  technicalSupportTitles
} from "../constants/customer-service-roles";
import { financeRoles } from "../constants/finance-roles";

export const getTitlesForITSpecialization = (specialization: string): string[] => {
  const {
    softwareDevTitles,
    itSupportTitles,
    networkingTitles,
    cybersecurityTitles,
    dataAnalyticsTitles,
    cloudComputingTitles,
    aiTitles,
    testingTitles,
    itManagementTitles,
    specializedITTitles
  } = itRoles;

  switch (specialization) {
    case "Software Development and Programming":
      return softwareDevTitles;
    case "IT Support and Operations":
      return itSupportTitles;
    case "Networking and Infrastructure":
      return networkingTitles;
    case "Cybersecurity":
      return cybersecurityTitles;
    case "Data and Analytics":
      return dataAnalyticsTitles;
    case "Cloud Computing":
      return cloudComputingTitles;
    case "Artificial Intelligence and Machine Learning":
      return aiTitles;
    case "Testing and Quality Assurance":
      return testingTitles;
    case "IT Management":
      return itManagementTitles;
    case "Specialised IT Roles":
      return specializedITTitles;
    default:
      return [];
  }
};

export const getTitlesForCustomerServiceSpecialization = (specialization: string): string[] => {
  switch (specialization) {
    case "Customer Support Roles":
      return customerSupportTitles;
    case "Customer Experience Roles":
      return customerExperienceTitles;
    case "Management Roles":
      return customerServiceManagementTitles;
    case "Sales and Retention Roles":
      return salesAndRetentionTitles;
    case "Specialised Customer Service Roles":
      return specializedCustomerServiceTitles;
    case "Technical and Advanced Support Roles":
      return technicalSupportTitles;
    default:
      return [];
  }
};

export const getTitlesForFinanceSpecialization = (specialization: string): string[] => {
  const {
    accountingRoles,
    financialAnalysisRoles,
    auditingRoles,
    bankingRoles,
    taxAndTreasuryRoles,
    financeOperationsRoles,
    specializedFinanceRoles
  } = financeRoles;

  switch (specialization) {
    case "Accounting Roles":
      return accountingRoles;
    case "Financial Analysis and Planning Roles":
      return financialAnalysisRoles;
    case "Auditing and Compliance Roles":
      return auditingRoles;
    case "Banking and Investment Roles":
      return bankingRoles;
    case "Tax and Treasury Roles":
      return taxAndTreasuryRoles;
    case "Finance Operations Roles":
      return financeOperationsRoles;
    case "Specialized Accounting and Finance Roles":
      return specializedFinanceRoles;
    default:
      return [];
  }
};

export const getTitlesForPublicSectorSpecialization = (specialization: string): string[] => {
  // Import and use public sector titles from constants
  return []; // Implement based on public sector roles
};

export const getTitlesForEngineeringSpecialization = (specialization: string): string[] => {
  // Import and use engineering titles from constants
  return []; // Implement based on engineering roles
};

export const getTitlesForHospitalitySpecialization = (specialization: string): string[] => {
  // Import and use hospitality titles from constants
  return []; // Implement based on hospitality roles
};