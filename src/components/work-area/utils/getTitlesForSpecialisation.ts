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
import { rdRoles } from "../constants/rd-roles";
import { salesRoles } from "../constants/sales-roles";

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
  return [];
};

export const getTitlesForEngineeringSpecialization = (specialization: string): string[] => {
  return [];
};

export const getTitlesForHospitalitySpecialization = (specialization: string): string[] => {
  return [];
};

export const getTitlesForRDSpecialization = (specialization: string): string[] => {
  const {
    productRDTitles,
    scientificResearchTitles,
    biomedicalResearchTitles,
    engineeringRDTitles,
    environmentalResearchTitles,
    technologyResearchTitles,
    industrialResearchTitles,
    materialsResearchTitles,
    clinicalResearchTitles,
    agriculturalResearchTitles
  } = rdRoles;

  switch (specialization) {
    case "Product Research and Development":
      return productRDTitles;
    case "Scientific Research":
      return scientificResearchTitles;
    case "Biomedical Research":
      return biomedicalResearchTitles;
    case "Engineering R&D":
      return engineeringRDTitles;
    case "Environmental Research":
      return environmentalResearchTitles;
    case "Technology Research":
      return technologyResearchTitles;
    case "Industrial Research":
      return industrialResearchTitles;
    case "Materials Research":
      return materialsResearchTitles;
    case "Clinical Research":
      return clinicalResearchTitles;
    case "Agricultural Research":
      return agriculturalResearchTitles;
    default:
      return [];
  }
};

export const getTitlesForSalesSpecialization = (specialization: string): string[] => {
  const {
    accountManagementTitles,
    businessDevelopmentTitles,
    insideSalesTitles,
    fieldSalesTitles,
    salesManagementTitles,
    technicalSalesTitles,
    enterpriseSalesTitles,
    channelSalesTitles,
    retailSalesTitles,
    salesOperationsTitles
  } = salesRoles;

  switch (specialization) {
    case "Account Management":
      return accountManagementTitles;
    case "Business Development":
      return businessDevelopmentTitles;
    case "Inside Sales":
      return insideSalesTitles;
    case "Field Sales":
      return fieldSalesTitles;
    case "Sales Management":
      return salesManagementTitles;
    case "Technical Sales":
      return technicalSalesTitles;
    case "Enterprise Sales":
      return enterpriseSalesTitles;
    case "Channel Sales":
      return channelSalesTitles;
    case "Retail Sales":
      return retailSalesTitles;
    case "Sales Operations":
      return salesOperationsTitles;
    default:
      return [];
  }
};
