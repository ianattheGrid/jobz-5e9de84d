
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
