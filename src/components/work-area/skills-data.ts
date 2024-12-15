// IT Skills (existing)
export const itSkills = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "Ruby",
  "PHP",
  "Swift",
  "SQL",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Git",
  "DevOps",
  "Machine Learning",
  "Artificial Intelligence"
];

// R&D Skills
export const rdSkills = [
  "Research Design",
  "Data Analysis",
  "Scientific Writing",
  "Laboratory Techniques",
  "Project Management",
  "Statistical Analysis",
  "Experimental Design",
  "Patent Research",
  "Product Development",
  "Innovation Management"
];

// Quality Assurance Skills
export const qaSkills = [
  "Quality Control",
  "Test Planning",
  "Process Improvement",
  "ISO Standards",
  "Regulatory Compliance",
  "Documentation",
  "Root Cause Analysis",
  "Auditing",
  "Risk Assessment",
  "Six Sigma"
];

// Sales Skills
export const salesSkills = [
  "Negotiation",
  "Client Relationship Management",
  "Sales Strategy",
  "Business Development",
  "Lead Generation",
  "Account Management",
  "Sales Analytics",
  "CRM Software",
  "Presentation Skills",
  "Contract Negotiation"
];

// Marketing Skills
export const marketingSkills = [
  "Digital Marketing",
  "Social Media Marketing",
  "Content Strategy",
  "SEO/SEM",
  "Brand Management",
  "Market Research",
  "Analytics",
  "Campaign Management",
  "Email Marketing",
  "Marketing Automation"
];

// Customer Service Skills
export const customerServiceSkills = [
  "Communication",
  "Problem Solving",
  "Customer Support",
  "Conflict Resolution",
  "CRM Systems",
  "Help Desk",
  "Technical Support",
  "Customer Satisfaction",
  "Call Center Operations",
  "Service Recovery"
];

// Accounting & Finance Skills
export const financeSkills = [
  "Financial Analysis",
  "Budgeting",
  "Forecasting",
  "Risk Management",
  "Financial Reporting",
  "Accounting Software",
  "Tax Preparation",
  "Auditing",
  "Investment Analysis",
  "Financial Modeling"
];

// HR Skills
export const hrSkills = [
  "Recruitment",
  "Employee Relations",
  "Training & Development",
  "Performance Management",
  "HR Policies",
  "Compensation & Benefits",
  "HRIS",
  "Labor Laws",
  "Talent Management",
  "Organizational Development"
];

// Legal Skills
export const legalSkills = [
  "Legal Research",
  "Contract Law",
  "Corporate Law",
  "Litigation",
  "Regulatory Compliance",
  "Legal Writing",
  "Negotiation",
  "Intellectual Property",
  "Due Diligence",
  "Case Management"
];

// Manufacturing Skills
export const manufacturingSkills = [
  "Production Planning",
  "Quality Control",
  "Lean Manufacturing",
  "Supply Chain Management",
  "Process Improvement",
  "Inventory Management",
  "Safety Compliance",
  "Equipment Maintenance",
  "CAD/CAM",
  "Six Sigma"
];

// Energy & Utilities Skills
export const energySkills = [
  "Power Generation",
  "Grid Operations",
  "Renewable Energy",
  "Energy Management",
  "Utility Operations",
  "Environmental Compliance",
  "Project Management",
  "Safety Standards",
  "Distribution Systems",
  "Energy Efficiency"
];

// Pharma Skills
export const pharmaSkills = [
  "Clinical Research",
  "Drug Development",
  "Regulatory Affairs",
  "Quality Control",
  "GMP",
  "Clinical Trials",
  "Pharmaceutical Analysis",
  "Drug Safety",
  "Pharmacology",
  "Research & Development"
];

// Public Sector Skills
export const publicSectorSkills = [
  "Public Policy",
  "Government Relations",
  "Program Management",
  "Grant Management",
  "Public Administration",
  "Policy Analysis",
  "Stakeholder Management",
  "Regulatory Compliance",
  "Budget Management",
  "Community Outreach"
];

// Engineering Skills
export const engineeringSkills = [
  "CAD",
  "Project Management",
  "Technical Drawing",
  "Process Design",
  "Quality Control",
  "Product Development",
  "Systems Engineering",
  "Mechanical Design",
  "Electrical Systems",
  "AutoCAD"
];

// Hospitality & Tourism Skills
export const hospitalitySkills = [
  "Customer Service",
  "Hotel Management",
  "Event Planning",
  "Food & Beverage",
  "Revenue Management",
  "Reservation Systems",
  "Tourism Marketing",
  "Guest Relations",
  "Hospitality Operations",
  "Travel Planning"
];

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