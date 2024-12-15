import { itSkills } from './it-skills';
import { rdSkills } from './rd-skills';
import { qaSkills } from './qa-skills';
import { salesSkills } from './sales-skills';
import { marketingSkills } from './marketing-skills';
import { customerServiceSkills } from './customer-service-skills';
import { financeSkills } from './finance-skills';
import { hrSkills } from './hr-skills';
import { legalSkills } from './legal-skills';
import { manufacturingSkills } from './manufacturing-skills';
import { energySkills } from './energy-skills';
import { pharmaSkills } from './pharma-skills';
import { publicSectorSkills } from './public-sector-skills';
import { engineeringSkills } from './engineering-skills';
import { hospitalitySkills } from './hospitality-skills';

export const getSkillsByWorkArea = (workArea: string): string[] => {
  switch (workArea) {
    case "R&D":
      return rdSkills;
    case "Quality Assurance":
      return qaSkills;
    case "Sales":
      return salesSkills;
    case "Marketing":
      return marketingSkills;
    case "Customer Service":
      return customerServiceSkills;
    case "IT":
      return itSkills;
    case "Accounting & Finance":
      return financeSkills;
    case "Human Resources":
      return hrSkills;
    case "Legal":
      return legalSkills;
    case "Manufacturing":
      return manufacturingSkills;
    case "Energy & Utilities":
      return energySkills;
    case "Pharma":
      return pharmaSkills;
    case "Public Sector":
      return publicSectorSkills;
    case "Engineering":
      return engineeringSkills;
    case "Hospitality & Tourism":
      return hospitalitySkills;
    default:
      return [];
  }
};

export {
  itSkills,
  rdSkills,
  qaSkills,
  salesSkills,
  marketingSkills,
  customerServiceSkills,
  financeSkills,
  hrSkills,
  legalSkills,
  manufacturingSkills,
  energySkills,
  pharmaSkills,
  publicSectorSkills,
  engineeringSkills,
  hospitalitySkills
};