
import { rdRoles } from "../../constants/rd-roles";

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
