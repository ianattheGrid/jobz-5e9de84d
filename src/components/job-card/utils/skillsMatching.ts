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

import { supabase } from "@/integrations/supabase/client";

export const findSimilarSkills = (skill: string): string[] => {
  const lowerSkill = skill.toLowerCase();
  
  // First check for exact group matches
  const exactGroup = similarSkillsGroups.find(group => 
    group.some(s => s.toLowerCase() === lowerSkill)
  );
  
  if (exactGroup) return exactGroup;

  // Then check for partial matches
  const partialGroup = similarSkillsGroups.find(group =>
    group.some(s => 
      s.toLowerCase().includes(lowerSkill) || 
      lowerSkill.includes(s.toLowerCase())
    )
  );
  
  return partialGroup || [skill];
};

export const calculateSkillsMatchScore = async (
  profileSkills: string[] = [], 
  jobSkills: string[] = [],
  cvUrl?: string | null
): Promise<number> => {
  if (!profileSkills.length || !jobSkills.length) return 0;

  const normalizedProfileSkills = profileSkills.map(skill => skill.toLowerCase());
  const normalizedJobSkills = jobSkills.map(skill => skill.toLowerCase());
  
  let profileSkillsScore = 0;
  const processedSkills = new Set<string>();

  // Calculate profile skills match with more nuanced scoring
  for (const jobSkill of normalizedJobSkills) {
    if (processedSkills.has(jobSkill)) continue;
    
    const similarSkills = findSimilarSkills(jobSkill)
      .map(s => s.toLowerCase());
    
    // Check for exact matches first
    if (similarSkills.some(skill => normalizedProfileSkills.includes(skill))) {
      profileSkillsScore += 1;
    }
    // Then check for partial matches
    else if (similarSkills.some(skill => 
      normalizedProfileSkills.some(profileSkill => 
        findSimilarSkills(profileSkill)
          .map(s => s.toLowerCase())
          .some(s => s.includes(skill) || skill.includes(s))
      )
    )) {
      profileSkillsScore += 0.7; // Partial match score
    }
    
    similarSkills.forEach(s => processedSkills.add(s));
  }

  // Calculate CV skills match if CV is available
  let cvSkillsScore = 0;
  if (cvUrl) {
    try {
      const { data } = await supabase.functions.invoke('parse-cv', {
        body: { fileUrl: cvUrl, requiredSkills: jobSkills }
      });
      
      cvSkillsScore = data?.cvSkillsMatchScore || 0;
    } catch (error) {
      console.error('Error analyzing CV:', error);
    }
  }

  // Normalize profile skills score
  profileSkillsScore = profileSkillsScore / jobSkills.length;

  // Final score combines profile skills (50%) and CV skills (50%)
  if (cvUrl) {
    return (profileSkillsScore * 0.5) + (cvSkillsScore * 0.5);
  }
  
  return profileSkillsScore;
};
