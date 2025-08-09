
import { salesRoles } from "../../constants/sales-roles";

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
