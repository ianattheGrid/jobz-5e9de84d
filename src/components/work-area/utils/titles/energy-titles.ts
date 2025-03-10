
export const getTitlesForEnergySpecialisation = (specialisation: string): string[] => {
  switch (specialisation) {
    case "Renewable Energy":
      return [
        "Renewable Energy Engineer",
        "Solar Energy Specialist",
        "Wind Energy Technician",
        "Renewable Energy Project Manager",
        "Energy Systems Designer"
      ];
    case "Oil and Gas":
      return [
        "Petroleum Engineer",
        "Drilling Engineer",
        "Reservoir Engineer",
        "Production Engineer",
        "Operations Manager"
      ];
    case "Power Generation":
      return [
        "Power Plant Manager",
        "Generation Engineer",
        "Control Room Operator",
        "Plant Maintenance Engineer",
        "Generation Operations Supervisor"
      ];
    case "Energy Distribution":
      return [
        "Distribution Network Manager",
        "Grid Operations Engineer",
        "Network Planning Engineer",
        "Distribution Systems Analyst",
        "Network Control Engineer"
      ];
    case "Energy Efficiency":
      return [
        "Energy Efficiency Consultant",
        "Energy Auditor",
        "Energy Management Specialist",
        "Building Energy Analyst",
        "Sustainability Engineer"
      ];
    case "Nuclear Energy":
      return [
        "Nuclear Engineer",
        "Nuclear Operations Manager",
        "Radiation Protection Specialist",
        "Nuclear Safety Officer",
        "Nuclear Systems Engineer"
      ];
    case "Smart Grid Technology":
      return [
        "Smart Grid Engineer",
        "Grid Integration Specialist",
        "Smart Meter Specialist",
        "Grid Automation Engineer",
        "Smart Grid Project Manager"
      ];
    case "Energy Storage":
      return [
        "Energy Storage Engineer",
        "Battery Systems Specialist",
        "Storage Solutions Designer",
        "Energy Storage Project Manager",
        "Systems Integration Engineer"
      ];
    case "Energy Trading":
      return [
        "Energy Trader",
        "Power Trading Analyst",
        "Energy Markets Specialist",
        "Trading Operations Manager",
        "Risk Management Analyst"
      ];
    case "Energy Policy and Regulation":
      return [
        "Energy Policy Analyst",
        "Regulatory Affairs Manager",
        "Compliance Officer",
        "Energy Law Specialist",
        "Policy Development Manager"
      ];
    default:
      return [];
  }
};
