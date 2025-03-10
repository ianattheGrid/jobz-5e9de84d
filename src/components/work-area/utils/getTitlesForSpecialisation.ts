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

export const getTitlesForMarketingSpecialisation = (specialisation: string): string[] => {
  switch (specialisation) {
    case "Digital Marketing":
      return [
        "Digital Marketing Manager",
        "Digital Marketing Specialist",
        "PPC Specialist",
        "Digital Campaign Manager"
      ];
    case "Content Marketing":
      return [
        "Content Marketing Manager",
        "Content Strategist",
        "Content Writer",
        "Content Creator"
      ];
    case "Social Media Marketing":
      return [
        "Social Media Manager",
        "Social Media Specialist",
        "Community Manager",
        "Social Media Coordinator"
      ];
    case "Brand Management":
      return [
        "Brand Manager",
        "Brand Strategist",
        "Brand Marketing Manager",
        "Brand Development Manager"
      ];
    case "Marketing Analytics":
      return [
        "Marketing Analytics Manager",
        "Marketing Data Analyst",
        "Marketing Intelligence Specialist",
        "Marketing Insights Manager"
      ];
    case "Product Marketing":
      return [
        "Product Marketing Manager",
        "Product Marketing Specialist",
        "Market Research Analyst",
        "Product Launch Manager"
      ];
    case "Email Marketing":
      return [
        "Email Marketing Manager",
        "Email Marketing Specialist",
        "CRM Manager",
        "Marketing Automation Specialist"
      ];
    case "SEO/SEM":
      return [
        "SEO Manager",
        "SEO Specialist",
        "SEM Manager",
        "Search Marketing Specialist"
      ];
    case "Marketing Strategy":
      return [
        "Marketing Strategy Manager",
        "Marketing Director",
        "Strategic Marketing Manager",
        "Growth Marketing Manager"
      ];
    case "Marketing Communications":
      return [
        "Marketing Communications Manager",
        "PR Manager",
        "Communications Specialist",
        "Marketing Communications Coordinator"
      ];
    default:
      return [];
  }
};

export const getTitlesForHRSpecialisation = (specialisation: string): string[] => {
  switch (specialisation) {
    case "Recruitment and Talent Acquisition":
      return [
        "Recruitment Manager",
        "Talent Acquisition Specialist",
        "Recruiter",
        "Talent Sourcing Specialist",
        "Head of Recruitment"
      ];
    case "Training and Development":
      return [
        "Training Manager",
        "Learning & Development Specialist",
        "Training Coordinator",
        "Corporate Trainer",
        "L&D Manager"
      ];
    case "Employee Relations":
      return [
        "Employee Relations Manager",
        "HR Business Partner",
        "Employee Relations Specialist",
        "Industrial Relations Manager",
        "Workplace Relations Advisor"
      ];
    case "Compensation and Benefits":
      return [
        "Compensation Manager",
        "Benefits Administrator",
        "Rewards Specialist",
        "C&B Analyst",
        "Total Rewards Manager"
      ];
    case "HR Information Systems (HRIS)":
      return [
        "HRIS Manager",
        "HRIS Analyst",
        "HR Systems Administrator",
        "HR Technology Specialist",
        "HRIS Coordinator"
      ];
    case "HR Business Partner":
      return [
        "HR Business Partner",
        "Senior HRBP",
        "Strategic HR Partner",
        "HR Consultant",
        "People Partner"
      ];
    case "HR Operations":
      return [
        "HR Operations Manager",
        "HR Administrator",
        "HR Coordinator",
        "HR Operations Specialist",
        "HR Services Manager"
      ];
    case "Organizational Development":
      return [
        "OD Manager",
        "Organizational Development Consultant",
        "Change Management Specialist",
        "OD Business Partner",
        "Culture and Engagement Manager"
      ];
    case "HR Analytics":
      return [
        "HR Analytics Manager",
        "People Analytics Specialist",
        "Workforce Analytics Analyst",
        "HR Data Scientist",
        "HR Reporting Analyst"
      ];
    case "HR Compliance":
      return [
        "HR Compliance Manager",
        "Employment Law Specialist",
        "HR Policy Officer",
        "Compliance Coordinator",
        "HR Governance Manager"
      ];
    default:
      return [];
  }
};

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

export const getTitlesForManufacturingSpecialisation = (specialisation: string): string[] => {
  switch (specialisation) {
    case "Production Management":
      return [
        "Production Manager",
        "Manufacturing Manager",
        "Plant Manager",
        "Production Supervisor",
        "Operations Manager"
      ];
    case "Quality Control":
      return [
        "Quality Control Manager",
        "Quality Inspector",
        "Quality Assurance Specialist",
        "Quality Control Technician",
        "Quality Systems Manager"
      ];
    case "Process Engineering":
      return [
        "Process Engineer",
        "Manufacturing Engineer",
        "Production Engineer",
        "Process Improvement Engineer",
        "Industrial Process Engineer"
      ];
    case "Supply Chain Management":
      return [
        "Supply Chain Manager",
        "Logistics Manager",
        "Inventory Manager",
        "Materials Manager",
        "Supply Chain Coordinator"
      ];
    case "Lean Manufacturing":
      return [
        "Lean Manufacturing Specialist",
        "Continuous Improvement Manager",
        "Lean Process Engineer",
        "Six Sigma Black Belt",
        "Lean Project Manager"
      ];
    case "Operations Management":
      return [
        "Operations Manager",
        "Factory Manager",
        "Production Operations Manager",
        "Manufacturing Operations Director",
        "Site Operations Manager"
      ];
    case "Maintenance Engineering":
      return [
        "Maintenance Engineer",
        "Equipment Engineer",
        "Plant Engineer",
        "Facilities Engineer",
        "Maintenance Manager"
      ];
    case "Industrial Engineering":
      return [
        "Industrial Engineer",
        "Manufacturing Systems Engineer",
        "Production Planning Engineer",
        "Process Optimization Engineer",
        "Industrial Systems Specialist"
      ];
    case "Safety Management":
      return [
        "Safety Manager",
        "EHS Manager",
        "Safety Engineer",
        "Health and Safety Coordinator",
        "Safety Compliance Manager"
      ];
    case "Production Planning":
      return [
        "Production Planner",
        "Manufacturing Planner",
        "Production Scheduler",
        "Planning and Control Manager",
        "Production Coordinator"
      ];
    default:
      return [];
  }
};
