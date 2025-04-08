
import { itRoles } from "../../constants/it-roles";

export const getTitlesForITSpecialisation = (specialisation: string): string[] => {
  console.log(`Getting titles for IT specialisation: ${specialisation}`);
  
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

  let titles: string[] = [];

  switch (specialisation) {
    case "Software Development and Programming":
      titles = softwareDevTitles;
      break;
    case "IT Support and Operations":
      titles = itSupportTitles;
      break;
    case "Networking and Infrastructure":
      titles = networkingTitles;
      break;
    case "Cybersecurity":
      titles = cybersecurityTitles;
      break;
    case "Data and Analytics":
      titles = dataAnalyticsTitles;
      break;
    case "Cloud Computing":
      titles = cloudComputingTitles;
      break;
    case "Artificial Intelligence and Machine Learning":
      titles = aiTitles;
      break;
    case "Testing and Quality Assurance":
      titles = testingTitles;
      break;
    case "IT Management":
      titles = itManagementTitles;
      break;
    case "Specialised IT Roles":
      titles = specializedITTitles;
      break;
    default:
      titles = [];
      break;
  }

  console.log(`Found ${titles.length} titles for ${specialisation}:`, titles);
  return titles;
};
