
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
