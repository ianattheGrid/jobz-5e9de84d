import { itRoles } from "../constants/it-roles";

export const getTitlesForITSpecialisation = (specialisation: string): string[] => {
  switch (specialisation) {
    case "Software Development and Programming":
      return itRoles.softwareDevTitles;
    case "IT Support and Operations":
      return itRoles.itSupportTitles;
    case "Networking and Infrastructure":
      return itRoles.networkingTitles;
    case "Cybersecurity":
      return itRoles.cybersecurityTitles;
    case "Data and Analytics":
      return itRoles.dataAnalyticsTitles;
    case "Cloud Computing":
      return itRoles.cloudComputingTitles;
    case "Artificial Intelligence and Machine Learning":
      return itRoles.aiTitles;
    case "Testing and Quality Assurance":
      return itRoles.testingTitles;
    case "IT Management":
      return itRoles.itManagementTitles;
    case "Specialised IT Roles":
      return itRoles.specializedITTitles;
    default:
      return [];
  }
};

// The rest of the existing functions (for other specializations)
export const getTitlesForCustomerServiceSpecialisation = (specialisation: string): string[] => {
    switch (specialisation) {
        case "Customer Support Roles":
            return [
                "Customer Service Representative",
                "Technical Support Specialist",
                "Call Center Agent",
                "Help Desk Analyst",
                "Chat Support Agent"
            ];
        case "Customer Experience Roles":
            return [
                "Customer Experience Manager",
                "Customer Success Manager",
                "User Experience (UX) Researcher",
                "Customer Journey Specialist",
                "Client Relations Manager"
            ];
        case "Management Roles":
            return [
                "Customer Service Manager",
                "Call Center Supervisor",
                "Customer Operations Director",
                "Client Services Director",
                "VP of Customer Experience"
            ];
        case "Sales and Retention Roles":
            return [
                "Account Manager",
                "Customer Retention Specialist",
                "Sales Development Representative",
                "Business Development Manager",
                "Key Account Executive"
            ];
        case "Specialised Customer Service Roles":
            return [
                "Complaint Resolution Officer",
                "Customer Advocate",
                "Loyalty Program Manager",
                "Customer Training Specialist",
                "Escalation Specialist"
            ];
        case "Technical and Advanced Support Roles":
            return [
                "Tier 2 Support Technician",
                "Application Support Analyst",
                "Field Service Engineer",
                "Product Support Specialist",
                "Technical Account Manager"
            ];
        default:
            return [];
    }
};

export const getTitlesForFinanceSpecialisation = (specialisation: string): string[] => {
    switch (specialisation) {
        case "Accounting":
            return [
                "Accountant",
                "Auditor",
                "Tax Accountant",
                "Payroll Specialist",
                "Bookkeeper"
            ];
        case "Financial Analysis":
            return [
                "Financial Analyst",
                "Budget Analyst",
                "Investment Analyst",
                "Risk Analyst",
                "Portfolio Manager"
            ];
        case "Banking":
            return [
                "Bank Teller",
                "Loan Officer",
                "Branch Manager",
                "Financial Advisor",
                "Credit Analyst"
            ];
        case "Insurance":
            return [
                "Insurance Agent",
                "Underwriter",
                "Claims Adjuster",
                "Actuary",
                "Risk Manager"
            ];
        case "Corporate Finance":
            return [
                "Finance Manager",
                "Treasurer",
                "Controller",
                "CFO",
                "Financial Planner"
            ];
        default:
            return [];
    }
};

export const getTitlesForHRSpecialisation = (specialisation: string): string[] => {
    switch (specialisation) {
        case "Recruitment":
            return [
                "Recruiter",
                "Talent Acquisition Specialist",
                "HR Generalist",
                "Recruiting Coordinator",
                "Executive Recruiter"
            ];
        case "Compensation and Benefits":
            return [
                "Compensation Analyst",
                "Benefits Administrator",
                "HR Manager",
                "Payroll Manager",
                "HR Director"
            ];
        case "Training and Development":
            return [
                "Training Specialist",
                "Instructional Designer",
                "HR Business Partner",
                "Organizational Development Manager",
                "Learning and Development Director"
            ];
        case "HR Management":
            return [
                "HR Manager",
                "HR Business Partner",
                "HR Director",
                "VP of HR",
                "Chief Human Resources Officer"
            ];
        case "Employee Relations":
            return [
                "Employee Relations Specialist",
                "HR Generalist",
                "Labor Relations Manager",
                "Compliance Officer",
                "HR Consultant"
            ];
        default:
            return [];
    }
};

export const getTitlesForLegalSpecialisation = (specialisation: string): string[] => {
    switch (specialisation) {
        case "Corporate Law":
            return [
                "Corporate Counsel",
                "Legal Associate",
                "Compliance Officer",
                "Contract Manager",
                "General Counsel"
            ];
        case "Criminal Law":
            return [
                "Criminal Defense Attorney",
                "Prosecutor",
                "Paralegal",
                "Legal Investigator",
                "Public Defender"
            ];
        case "Family Law":
            return [
                "Family Law Attorney",
                "Divorce Mediator",
                "Child Custody Lawyer",
                "Adoption Lawyer",
                "Legal Assistant"
            ];
        case "Real Estate Law":
            return [
                "Real Estate Attorney",
                "Title Examiner",
                "Property Manager",
                "Lease Administrator",
                "Real Estate Paralegal"
            ];
        case "Intellectual Property Law":
            return [
                "Patent Attorney",
                "Trademark Attorney",
                "Copyright Lawyer",
                "IP Paralegal",
                "Licensing Manager"
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
                "Operations Manager",
                "Plant Supervisor",
                "Manufacturing Engineer",
                "Quality Control Manager"
            ];
        case "Quality Assurance":
            return [
                "Quality Assurance Manager",
                "Quality Control Inspector",
                "Quality Engineer",
                "Compliance Officer",
                "Auditor"
            ];
        case "Supply Chain Management":
            return [
                "Supply Chain Manager",
                "Logistics Coordinator",
                "Purchasing Manager",
                "Inventory Control Specialist",
                "Warehouse Manager"
            ];
        case "Engineering":
            return [
                "Manufacturing Engineer",
                "Process Engineer",
                "Industrial Engineer",
                "Mechanical Engineer",
                "Electrical Engineer"
            ];
        case "Maintenance and Repair":
            return [
                "Maintenance Technician",
                "Maintenance Supervisor",
                "Equipment Mechanic",
                "Field Service Technician",
                "Maintenance Manager"
            ];
        default:
            return [];
    }
};

export const getTitlesForEnergySpecialisation = (specialisation: string): string[] => {
    switch (specialisation) {
        case "Renewable Energy":
            return [
                "Solar Energy Engineer",
                "Wind Turbine Technician",
                "Renewable Energy Project Manager",
                "Energy Efficiency Consultant",
                "Sustainability Manager"
            ];
        case "Oil and Gas":
            return [
                "Petroleum Engineer",
                "Drilling Supervisor",
                "Geologist",
                "Reservoir Engineer",
                "Refinery Operator"
            ];
        case "Nuclear Energy":
            return [
                "Nuclear Engineer",
                "Reactor Operator",
                "Health Physicist",
                "Nuclear Technician",
                "Radiation Protection Specialist"
            ];
        case "Energy Management":
            return [
                "Energy Manager",
                "Energy Analyst",
                "Energy Auditor",
                "Sustainability Coordinator",
                "Energy Consultant"
            ];
        case "Utilities":
            return [
                "Electrical Engineer",
                "Power Plant Operator",
                "Transmission and Distribution Engineer",
                "Utility Technician",
                "Grid Operator"
            ];
        default:
            return [];
    }
};

export const getTitlesForPharmaSpecialisation = (specialisation: string): string[] => {
    switch (specialisation) {
        case "Research and Development":
            return [
                "Research Scientist",
                "Research Associate",
                "Lab Technician",
                "Clinical Research Coordinator",
                "Data Analyst"
            ];
        case "Manufacturing and Production":
            return [
                "Production Manager",
                "Process Engineer",
                "Quality Control Analyst",
                "Validation Engineer",
                "Packaging Specialist"
            ];
        case "Quality Assurance and Compliance":
            return [
                "Quality Assurance Manager",
                "Compliance Officer",
                "Regulatory Affairs Specialist",
                "Auditor",
                "Quality Control Inspector"
            ];
        case "Sales and Marketing":
            return [
                "Pharmaceutical Sales Representative",
                "Marketing Manager",
                "Product Manager",
                "Market Research Analyst",
                "Medical Science Liaison"
            ];
        case "Clinical Operations":
            return [
                "Clinical Trial Manager",
                "Clinical Research Associate",
                "Data Manager",
                "Medical Writer",
                "Pharmacovigilance Specialist"
            ];
        default:
            return [];
    }
};

export const getTitlesForQASpecialisation = (specialisation: string): string[] => {
    switch (specialisation) {
        case "Software QA":
            return [
                "QA Tester",
                "QA Analyst",
                "Test Automation Engineer",
                "QA Lead",
                "QA Manager"
            ];
        case "Manufacturing QA":
            return [
                "Quality Control Inspector",
                "Quality Assurance Specialist",
                "Quality Engineer",
                "QA Supervisor",
                "QA Manager"
            ];
        case "Food and Beverage QA":
            return [
                "Quality Control Technician",
                "Food Safety Specialist",
                "QA Auditor",
                "Regulatory Compliance Officer",
                "QA Manager"
            ];
        case "Pharmaceutical QA":
            return [
                "Quality Assurance Associate",
                "Validation Specialist",
                "Compliance Manager",
                "QA Supervisor",
                "QA Director"
            ];
        case "Environmental QA":
            return [
                "Environmental Compliance Inspector",
                "Environmental Health and Safety Specialist",
                "QA Auditor",
                "Regulatory Affairs Manager",
                "Environmental Manager"
            ];
        default:
            return [];
    }
};

export const getTitlesForRDSpecialisation = (specialisation: string): string[] => {
    switch (specialisation) {
        case "Biotechnology R&D":
            return [
                "Research Scientist",
                "Research Associate",
                "Lab Technician",
                "Bioinformatician",
                "Clinical Research Coordinator"
            ];
        case "Pharmaceutical R&D":
            return [
                "Research Scientist",
                "Formulation Scientist",
                "Clinical Trial Manager",
                "Medical Writer",
                "Pharmacovigilance Specialist"
            ];
        case "Engineering R&D":
            return [
                "Research Engineer",
                "Design Engineer",
                "Test Engineer",
                "Product Development Engineer",
                "R&D Manager"
            ];
        case "Materials Science R&D":
            return [
                "Materials Scientist",
                "Research Chemist",
                "Lab Manager",
                "Process Engineer",
                "R&D Director"
            ];
        case "Software R&D":
            return [
                "Research Scientist",
                "Software Engineer",
                "Data Scientist",
                "AI/ML Researcher",
                "R&D Manager"
            ];
        default:
            return [];
    }
};

export const getTitlesForMarketingSpecialisation = (specialisation: string): string[] => {
    switch (specialisation) {
        case "Digital Marketing":
            return [
                "Digital Marketing Specialist",
                "SEO Specialist",
                "SEM Specialist",
                "Social Media Manager",
                "Content Marketing Manager"
            ];
        case "Brand Management":
            return [
                "Brand Manager",
                "Marketing Manager",
                "Product Manager",
                "Market Research Analyst",
                "Marketing Director"
            ];
        case "Marketing Communications":
            return [
                "Marketing Communications Manager",
                "Public Relations Specialist",
                "Communications Coordinator",
                "Content Strategist",
                "Marketing Director"
            ];
        case "Market Research":
            return [
                "Market Research Analyst",
                "Data Analyst",
                "Insights Manager",
                "Marketing Consultant",
                "Research Director"
            ];
        case "Advertising":
            return [
                "Advertising Manager",
                "Media Planner",
                "Creative Director",
                "Account Executive",
                "Marketing Director"
            ];
        default:
            return [];
    }
};

export const getTitlesForPublicSectorSpecialisation = (specialisation: string): string[] => {
    switch (specialisation) {
        case "Government Administration":
            return [
                "City Manager",
                "County Administrator",
                "Public Policy Analyst",
                "Government Relations Manager",
                "Legislative Assistant"
            ];
        case "Public Safety":
            return [
                "Police Officer",
                "Firefighter",
                "Emergency Medical Technician",
                "Corrections Officer",
                "Security Guard"
            ];
        case "Education":
            return [
                "Teacher",
                "Professor",
                "School Administrator",
                "Curriculum Developer",
                "Education Consultant"
            ];
        case "Healthcare":
            return [
                "Registered Nurse",
                "Physician",
                "Medical Assistant",
                "Healthcare Administrator",
                "Public Health Specialist"
            ];
        case "Social Services":
            return [
                "Social Worker",
                "Case Manager",
                "Community Outreach Coordinator",
                "Counselor",
                "Program Director"
            ];
        default:
            return [];
    }
};
