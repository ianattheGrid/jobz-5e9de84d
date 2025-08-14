// Job title similarity groups for better matching
const jobTitleSimilarityGroups = [
  // Software Development
  ['Software Engineer', 'Software Developer', 'Developer', 'Programmer', 'Coder'],
  ['Full Stack Developer', 'Full-Stack Engineer', 'Fullstack Developer', 'Full Stack Engineer'],
  ['Frontend Developer', 'Front-End Developer', 'Front End Developer', 'UI Developer'],
  ['Backend Developer', 'Back-End Developer', 'Back End Developer', 'Server-Side Developer'],
  ['Senior Software Engineer', 'Senior Developer', 'Senior Software Developer', 'Lead Developer'],
  ['Junior Software Engineer', 'Junior Developer', 'Junior Software Developer', 'Entry Level Developer'],
  
  // Web Development
  ['Web Developer', 'Website Developer', 'Web Programmer'],
  ['React Developer', 'React.js Developer', 'ReactJS Developer'],
  ['Node.js Developer', 'NodeJS Developer', 'Node Developer'],
  
  // Data & AI
  ['Data Scientist', 'Data Science Engineer', 'ML Engineer', 'Machine Learning Engineer'],
  ['Data Analyst', 'Data Analytics Specialist', 'Business Intelligence Analyst'],
  ['AI Engineer', 'Artificial Intelligence Engineer', 'AI Specialist'],
  
  // DevOps & Cloud
  ['DevOps Engineer', 'DevOps Specialist', 'Site Reliability Engineer', 'SRE'],
  ['Cloud Engineer', 'Cloud Architect', 'Cloud Specialist'],
  ['AWS Engineer', 'AWS Specialist', 'Amazon Web Services Engineer'],
  
  // Management
  ['IT Manager', 'Technology Manager', 'Tech Manager'],
  ['Engineering Manager', 'Development Manager', 'Software Development Manager'],
  ['IT Director', 'Technology Director', 'Chief Technology Officer', 'CTO'],
  ['Project Manager', 'Technical Project Manager', 'IT Project Manager'],
  
  // Quality & Testing
  ['QA Engineer', 'Quality Assurance Engineer', 'Test Engineer', 'Software Tester'],
  ['Automation Tester', 'Test Automation Engineer', 'QA Automation Engineer'],
  
  // Security
  ['Security Engineer', 'Cybersecurity Engineer', 'Information Security Engineer'],
  ['Security Analyst', 'Cybersecurity Analyst', 'Information Security Analyst'],
  
  // Database
  ['Database Administrator', 'DBA', 'Database Engineer'],
  ['Data Engineer', 'Database Developer', 'Data Platform Engineer'],
  
  // Mobile
  ['Mobile Developer', 'Mobile App Developer', 'iOS Developer', 'Android Developer'],
  ['React Native Developer', 'Cross-Platform Developer'],
  
  // System Administration
  ['System Administrator', 'Systems Admin', 'IT Administrator'],
  ['Network Administrator', 'Network Engineer', 'Network Specialist'],
  
  // Product & Design
  ['Product Manager', 'Product Owner', 'Technical Product Manager'],
  ['UI/UX Designer', 'UX Designer', 'UI Designer', 'User Experience Designer'],
  
  // Architecture
  ['Software Architect', 'System Architect', 'Technical Architect'],
  ['Solutions Architect', 'Enterprise Architect'],
];

export const findSimilarJobTitles = (jobTitle: string): string[] => {
  const lowerTitle = jobTitle.toLowerCase();
  
  // First check for exact group matches
  const exactGroup = jobTitleSimilarityGroups.find(group => 
    group.some(title => title.toLowerCase() === lowerTitle)
  );
  
  if (exactGroup) return exactGroup;

  // Then check for partial matches
  const partialGroup = jobTitleSimilarityGroups.find(group =>
    group.some(title => 
      title.toLowerCase().includes(lowerTitle) || 
      lowerTitle.includes(title.toLowerCase())
    )
  );
  
  return partialGroup || [jobTitle];
};

export const calculateJobTitleMatchScore = (
  candidateJobTitle: string,
  jobWorkArea: string,
  jobSpecialization?: string
): number => {
  if (!candidateJobTitle || !jobWorkArea) return 0;

  const candidateTitleLower = candidateJobTitle.toLowerCase();
  const workAreaLower = jobWorkArea.toLowerCase();
  const specializationLower = jobSpecialization?.toLowerCase();

  // Get similar job titles for the candidate's title
  const similarTitles = findSimilarJobTitles(candidateJobTitle)
    .map(title => title.toLowerCase());

  let score = 0;

  // 1. Exact match with work area (highest score)
  if (candidateTitleLower === workAreaLower) {
    score = 1.0;
  }
  // 2. Candidate title contains work area or vice versa
  else if (candidateTitleLower.includes(workAreaLower) || 
           workAreaLower.includes(candidateTitleLower)) {
    score = 0.8;
  }
  // 3. Similar job titles match
  else if (similarTitles.some(title => 
    title.includes(workAreaLower) || workAreaLower.includes(title)
  )) {
    score = 0.7;
  }
  // 4. Specialization match (if available)
  else if (specializationLower && (
    candidateTitleLower.includes(specializationLower) ||
    specializationLower.includes(candidateTitleLower) ||
    similarTitles.some(title => 
      title.includes(specializationLower) || specializationLower.includes(title)
    )
  )) {
    score = 0.6;
  }
  // 5. Partial keyword matches
  else {
    const candidateWords = candidateTitleLower.split(/\s+/);
    const workAreaWords = workAreaLower.split(/\s+/);
    const matchingWords = candidateWords.filter(word => 
      workAreaWords.some(workWord => 
        word.includes(workWord) || workWord.includes(word)
      )
    );
    
    if (matchingWords.length > 0) {
      score = (matchingWords.length / Math.max(candidateWords.length, workAreaWords.length)) * 0.5;
    }
  }

  return Math.min(score, 1.0); // Ensure score doesn't exceed 1.0
};

// Enhanced function to check if job titles are similar enough to match
export const areJobTitlesSimilar = (
  title1: string, 
  title2: string, 
  threshold: number = 0.6
): boolean => {
  const score1 = calculateJobTitleMatchScore(title1, title2);
  const score2 = calculateJobTitleMatchScore(title2, title1);
  const maxScore = Math.max(score1, score2);
  
  return maxScore >= threshold;
};