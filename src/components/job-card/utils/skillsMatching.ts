
// Groups of similar/related skills for better matching
const similarSkillsGroups = [
  // Programming Languages
  ['JavaScript', 'TypeScript', 'ECMAScript'],
  ['Python', 'Django', 'Flask', 'FastAPI'],
  ['Java', 'Kotlin', 'Spring', 'J2EE'],
  ['C#', '.NET', 'ASP.NET'],
  ['PHP', 'Laravel', 'Symfony'],
  ['Ruby', 'Ruby on Rails'],
  
  // Frontend
  ['React', 'React.js', 'ReactJS'],
  ['Vue', 'Vue.js', 'VueJS'],
  ['Angular', 'AngularJS'],
  ['HTML', 'HTML5'],
  ['CSS', 'CSS3', 'SCSS', 'SASS', 'Styled Components'],
  
  // Backend & Databases
  ['SQL', 'MySQL', 'PostgreSQL', 'Oracle'],
  ['NoSQL', 'MongoDB', 'DynamoDB', 'Cassandra'],
  ['REST', 'RESTful', 'REST API', 'RESTful API'],
  ['GraphQL', 'Apollo'],
  
  // Cloud & DevOps
  ['AWS', 'Amazon Web Services', 'EC2', 'S3'],
  ['Azure', 'Microsoft Azure'],
  ['Docker', 'Containerization', 'Kubernetes', 'K8s'],
  ['CI/CD', 'Jenkins', 'GitLab CI', 'GitHub Actions'],
  
  // AI & Data
  ['Machine Learning', 'ML', 'AI', 'Artificial Intelligence'],
  ['Data Science', 'Data Analysis', 'Data Analytics'],
  ['Deep Learning', 'Neural Networks'],
  ['NLP', 'Natural Language Processing'],
  
  // Testing
  ['Testing', 'QA', 'Quality Assurance'],
  ['Unit Testing', 'Jest', 'Mocha'],
  ['E2E Testing', 'End-to-End Testing', 'Cypress', 'Selenium'],
  
  // Project Management
  ['Agile', 'Scrum', 'Kanban'],
  ['JIRA', 'Confluence', 'Atlassian'],
  ['Project Management', 'Product Management'],
];

export const findSimilarSkills = (skill: string): string[] => {
  const lowerSkill = skill.toLowerCase();
  const group = similarSkillsGroups.find(group => 
    group.some(s => s.toLowerCase() === lowerSkill)
  );
  return group || [skill];
};

export const calculateSkillsMatchScore = (
  profileSkills: string[] = [], 
  jobSkills: string[] = []
): number => {
  if (!profileSkills.length || !jobSkills.length) return 0;

  const normalizedProfileSkills = profileSkills.map(skill => skill.toLowerCase());
  const normalizedJobSkills = jobSkills.map(skill => skill.toLowerCase());
  
  let matches = 0;
  const processedSkills = new Set<string>();

  // Check each job skill against profile skills and their similar variations
  for (const jobSkill of normalizedJobSkills) {
    if (processedSkills.has(jobSkill)) continue;
    
    const similarSkills = findSimilarSkills(jobSkill)
      .map(s => s.toLowerCase());
    
    // If any variation of the skill is found in profile skills, count it as a match
    if (similarSkills.some(skill => 
      normalizedProfileSkills.includes(skill) || 
      normalizedProfileSkills.some(profileSkill => 
        findSimilarSkills(profileSkill)
          .map(s => s.toLowerCase())
          .includes(skill)
      )
    )) {
      matches++;
    }
    
    similarSkills.forEach(s => processedSkills.add(s));
  }

  return matches / jobSkills.length;
};
