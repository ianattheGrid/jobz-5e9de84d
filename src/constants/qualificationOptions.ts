export const educationLevels = [
  "GCSE/O-Level",
  "A-Level",
  "Diploma/Certificate",
  "Foundation Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD/Doctorate",
  "Professional Qualification"
];

export const fieldsOfStudy = [
  "Computer Science",
  "Software Engineering", 
  "Information Technology",
  "Engineering (General)",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Mathematics",
  "Physics",
  "Business Administration",
  "Management",
  "Finance",
  "Accounting",
  "Economics",
  "Marketing",
  "Psychology",
  "Law",
  "Medicine",
  "Nursing",
  "Education",
  "Design",
  "Architecture",
  "Data Science",
  "Cybersecurity",
  "Digital Marketing",
  "Project Management",
  "Human Resources",
  "Operations Management",
  "Supply Chain Management",
  "Other"
];

// Work area specific certifications
export const certificationsByWorkArea = {
  "IT": [
    // Cloud & Infrastructure
    "AWS Certified Solutions Architect",
    "AWS Certified Developer",
    "AWS Certified SysOps Administrator",
    "Microsoft Azure Fundamentals",
    "Microsoft Azure Administrator",
    "Microsoft Azure Solutions Architect",
    "Google Cloud Professional",
    "VMware Certified Professional",
    
    // Security
    "CISSP",
    "CISM",
    "CompTIA Security+",
    "CEH (Certified Ethical Hacker)",
    
    // Microsoft
    "Microsoft 365 Certified",
    "Microsoft Power Platform",
    "Microsoft Dynamics",
    
    // Databases
    "Oracle Certified Professional",
    "MongoDB Certified Developer",
    "MySQL Certified",
    
    // Networking
    "Cisco CCNA",
    "Cisco CCNP",
    "CompTIA Network+",
    
    // Data & Analytics
    "Tableau Certified",
    "Power BI Certified",
    "Google Analytics Certified",
    "Salesforce Certified",
    
    // ITIL & Service Management
    "ITIL Foundation",
    "ITIL Expert"
  ],
  
  "R&D": [
    // Research & Development
    "Chartered Scientist (CSci)",
    "Chartered Chemist (CChem)",
    "Chartered Biologist (CBiol)",
    "Chartered Physicist (CPhys)",
    "Chartered Mathematician (CMath)",
    "Registered Scientist (RSci)",
    "Associate of the Royal Society of Chemistry (ARSC)",
    "Member of the Royal Society of Chemistry (MRSC)",
    "Fellow of the Royal Society of Chemistry (FRSC)",
    "Good Clinical Practice (GCP)",
    "Good Laboratory Practice (GLP)",
    "Good Manufacturing Practice (GMP)",
    "Clinical Research Associate (CRA)",
    "Clinical Data Management (CDM)",
    "Regulatory Affairs Certification (RAC)",
    "Project Management Professional (PMP)",
    "Lean Six Sigma Green Belt",
    "Lean Six Sigma Black Belt"
  ],
  
  "Finance": [
    "ACCA",
    "CIMA", 
    "ACA",
    "CPA",
    "FRM",
    "CFA",
    "AAT",
    "CISI",
    "IMC"
  ],
  
  "Engineering": [
    "Chartered Engineer (CEng)",
    "Incorporated Engineer (IEng)",
    "Engineering Technician (EngTech)",
    "Professional Engineer (PE)",
    "Certified Energy Manager (CEM)",
    "Lean Six Sigma Green Belt",
    "Lean Six Sigma Black Belt"
  ],
  
  "HR": [
    "CIPD Certification",
    "SHRM-CP",
    "SHRM-SCP",
    "PHR",
    "SPHR",
    "GPHR"
  ],
  
  "Marketing": [
    "Google Ads Certified",
    "Google Analytics Certified",
    "HubSpot Certified",
    "Facebook Blueprint Certified",
    "Chartered Institute of Marketing (CIM)",
    "Digital Marketing Institute (DMI)"
  ],
  
  "Sales": [
    "Certified Professional Sales Person (CPSP)",
    "Certified Sales Executive (CSE)",
    "Salesforce Certified",
    "HubSpot Sales Certified"
  ],
  
  "Legal": [
    "Solicitor",
    "Barrister",
    "Legal Executive",
    "Paralegal Certification",
    "Notary Public"
  ],
  
  "Pharma": [
    "Good Clinical Practice (GCP)",
    "Good Laboratory Practice (GLP)",
    "Good Manufacturing Practice (GMP)",
    "Clinical Research Associate (CRA)",
    "Regulatory Affairs Certification (RAC)",
    "Pharmacovigilance Certification",
    "Quality Assurance Certification"
  ],
  
  "Quality Assurance": [
    "Six Sigma Green Belt",
    "Six Sigma Black Belt",
    "Certified Quality Auditor (CQA)",
    "Certified Quality Engineer (CQE)",
    "ISO 9001 Lead Auditor",
    "ASQ Certification"
  ],
  
  "Manufacturing": [
    "Lean Manufacturing Certification",
    "Six Sigma Green Belt",
    "Six Sigma Black Belt",
    "Certified Production and Inventory Management (CPIM)",
    "Certified Supply Chain Professional (CSCP)"
  ],
  
  "Energy & Utilities": [
    "Certified Energy Manager (CEM)",
    "Energy Efficiency Professional (EEP)",
    "Renewable Energy Professional (REP)",
    "NEBOSH Environmental Certificate"
  ],
  
  "Customer Service": [
    "Customer Service Institute Certification",
    "Help Desk Institute Certification",
    "Customer Experience Professional (CXP)"
  ],
  
  "Public Sector": [
    "Chartered Institute of Public Finance and Accountancy (CIPFA)",
    "Institute of Revenues Rating and Valuation (IRRV)",
    "Chartered Institute of Housing (CIH)"
  ]
};

// Generic certifications that apply to multiple areas
export const genericCertifications = [
  "PMP (Project Management Professional)",
  "PRINCE2",
  "Agile/Scrum Master",
  "Certified ScrumMaster (CSM)",
  "Six Sigma Green Belt",
  "Six Sigma Black Belt",
  "TOGAF Certified",
  "Other"
];

// Helper function to get certifications for a specific work area
export const getCertificationsForWorkArea = (workArea: string): string[] => {
  const workAreaCerts = certificationsByWorkArea[workArea as keyof typeof certificationsByWorkArea] || [];
  return [...workAreaCerts, ...genericCertifications];
};

// Get only work-area-specific certifications (without generic ones)
export const getSpecificCertificationsForWorkArea = (workArea: string): string[] => {
  return certificationsByWorkArea[workArea as keyof typeof certificationsByWorkArea] || [];
};

// Backward compatibility - use IT certifications as default
export const industryCertifications = getCertificationsForWorkArea("IT");

export const securityClearanceLevels = [
  "None Required",
  "Basic Personnel Security Standard (BPSS)",
  "Counter-Terrorist Check (CTC)", 
  "Security Check (SC)",
  "Developed Vetting (DV)",
  "Enhanced Developed Vetting (eDV)",
  "NATO Secret",
  "NATO Top Secret",
  "US Secret Clearance",
  "US Top Secret Clearance"
];

export const professionalMemberships = [
  // Engineering
  "Institution of Engineering and Technology (IET)",
  "Institution of Mechanical Engineers (IMechE)",
  "Institution of Civil Engineers (ICE)",
  "Institution of Electrical Engineers (IEE)",
  "Royal Academy of Engineering",
  "Chartered Engineer (CEng)",
  
  // Finance & Accounting
  "Institute of Chartered Accountants (ICAEW)",
  "Association of Chartered Certified Accountants (ACCA)",
  "Chartered Institute of Management Accountants (CIMA)",
  "Institute of Financial Accountants (IFA)",
  
  // IT & Technology
  "British Computer Society (BCS)",
  "Institution of Analysts and Programmers (IAP)",
  "Chartered Institute for IT",
  
  // Project Management
  "Association for Project Management (APM)",
  "Project Management Institute (PMI)",
  
  // HR & Business
  "Chartered Institute of Personnel and Development (CIPD)",
  "Chartered Management Institute (CMI)",
  "Institute of Directors (IoD)",
  
  // Marketing
  "Chartered Institute of Marketing (CIM)",
  "Institute of Direct and Digital Marketing (IDM)",
  
  // Legal
  "Law Society",
  "Bar Council",
  "Chartered Institute of Legal Executives (CILEx)",
  
  // Other
  "Royal Institution of Chartered Surveyors (RICS)",
  "Chartered Institute of Logistics and Transport (CILT)",
  "Other"
];

export const languageRequirements = [
  "English (Native/Fluent)",
  "Spanish",
  "French", 
  "German",
  "Italian",
  "Portuguese",
  "Mandarin Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Russian",
  "Dutch",
  "Polish",
  "Other"
];

export const languageProficiencyLevels = [
  "Basic (A1-A2)",
  "Intermediate (B1-B2)", 
  "Advanced (C1)",
  "Native/Fluent (C2)"
];

export const drivingLicenseTypes = [
  "Full UK Driving License",
  "International Driving License",
  "Clean Driving License (no points)",
  "Category B (Car)",
  "Category C1 (Small Lorry)",
  "Category C (Large Lorry)",
  "Category D1 (Minibus)",
  "Category D (Bus)"
];

export const backgroundCheckTypes = [
  "Basic DBS Check",
  "Standard DBS Check", 
  "Enhanced DBS Check",
  "Enhanced DBS with Barred Lists",
  "Criminal Record Check",
  "Credit Check",
  "Employment History Verification",
  "Education Verification",
  "Professional Reference Check"
];
