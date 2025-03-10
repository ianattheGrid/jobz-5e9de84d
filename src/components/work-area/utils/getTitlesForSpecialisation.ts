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
import { allQARoles } from '../constants/qa-roles';

export const getTitlesForITSpecialisation = (specialisation: string): string[] => {
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

  switch (specialisation) {
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

export const getTitlesForCustomerServiceSpecialisation = (specialisation: string): string[] => {
  switch (specialisation) {
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

export const getTitlesForFinanceSpecialisation = (specialisation: string): string[] => {
  const {
    accountingRoles,
    financialAnalysisRoles,
    auditingRoles,
    bankingRoles,
    taxAndTreasuryRoles,
    financeOperationsRoles,
    specializedFinanceRoles
  } = financeRoles;

  switch (specialisation) {
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

export const getTitlesForPublicSectorSpecialisation = (specialisation: string): string[] => {
  return [];
};

export const getTitlesForEngineeringSpecialisation = (specialisation: string): string[] => {
  return [];
};

export const getTitlesForHospitalitySpecialisation = (specialisation: string): string[] => {
  return [];
};

export const getTitlesForRDSpecialisation = (specialisation: string): string[] => {
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

  switch (specialisation) {
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

export const getTitlesForSalesSpecialisation = (specialisation: string): string[] => {
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

  switch (specialisation) {
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

export const getTitlesForQASpecialisation = (specialisation: string): string[] => {
  switch (specialisation) {
    case "Software Testing":
      return allQARoles.softwareTestingRoles;
    case "Manufacturing QA":
      return allQARoles.manufacturingQARoles;
    case "Food & Beverage QA":
      return allQARoles.foodQARoles;
    case "Healthcare QA":
      return allQARoles.healthcareQARoles;
    case "Regulatory Compliance":
      return allQARoles.regulatoryRoles;
    case "Product Quality":
      return allQARoles.productQARoles;
    case "Process Quality":
      return allQARoles.processQARoles;
    case "Quality Systems":
      return allQARoles.qualitySystemsRoles;
    case "Quality Engineering":
      return allQARoles.qualityEngineeringRoles;
    case "Specialized QA":
      return allQARoles.specializedQARoles;
    default:
      return [];
  }
};
