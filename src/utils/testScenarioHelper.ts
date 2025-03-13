
import { supabase } from "@/integrations/supabase/client";

export const setupTestScenario = async () => {
  try {
    // 1. Create test employer account with comprehensive profile
    const { data: employerData, error: employerError } = await supabase.auth.signUp({
      email: 'test.employer@example.com',
      password: 'testpass123',
      options: {
        data: {
          user_type: 'employer',
          full_name: 'Test Employer',
        }
      }
    });
    
    if (employerError) throw employerError;

    // Create detailed employer profile
    await supabase.from('employer_profiles').insert({
      id: employerData.user?.id,
      company_name: 'Tech Solutions Ltd',
      full_name: 'Test Employer',
      job_title: 'HR Director',
      company_website: 'https://techsolutions.example.com',
      linkedin_url: 'https://linkedin.com/company/techsolutions'
    });

    // 2. Create test candidate account with matching skills
    const { data: candidateData, error: candidateError } = await supabase.auth.signUp({
      email: 'test.candidate@example.com',
      password: 'testpass123',
      options: {
        data: {
          user_type: 'candidate',
          full_name: 'Test Candidate',
        }
      }
    });

    if (candidateError) throw candidateError;

    // Create candidate profile matching job requirements
    await supabase.from('candidate_profiles').insert({
      id: candidateData.user?.id,
      email: 'test.candidate@example.com',
      full_name: 'Test Developer',
      job_title: 'Senior Frontend Developer',
      years_experience: 6,
      min_salary: 65000,
      max_salary: 85000,
      location: ['Bristol'],
      required_skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
      additional_skills: 'Jest, CI/CD, Docker',
      work_eligibility: 'UK citizens only',
      years_in_current_title: 4,
      current_employer: 'Previous Tech Corp',
      desired_job_title: 'Senior Frontend Developer',
      required_qualifications: ['BSc Computer Science'],
      availability: 'Immediate',
      preferred_work_type: 'hybrid'
    });

    // 3. Create a detailed test job posting that should match well
    const { data: jobData, error: jobError } = await supabase.from('jobs').insert({
      employer_id: employerData.user?.id,
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Ltd',
      description: 'We are seeking an experienced Frontend Developer with strong React and TypeScript skills...',
      location: 'Bristol',
      salary_min: 60000,
      salary_max: 90000,
      type: 'Full-time',
      work_area: 'Frontend Development',
      specialization: 'Frontend',
      required_skills: ['React', 'TypeScript', 'Node.js'],
      required_qualifications: ['BSc'],
      holiday_entitlement: 25,
      company_benefits: 'Health insurance, Remote working, Learning budget',
      candidate_commission: 5000,
      title_essential: true,
      years_experience_essential: true,
      min_years_experience: 5,
      salary_essential: true,
      skills_essential: true,
      qualification_essential: false,
      citizenship_essential: true,
      required_citizenship: 'UK citizens only',
      min_years_in_title: 3,
      match_threshold: 70
    }).select().single();

    if (jobError) throw jobError;

    // Calculate and log the match score
    const { data: profile } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('id', candidateData.user?.id)
      .single();

    if (profile && jobData) {
      const { useMatchScore } = await import('../components/job-card/hooks/useMatchScore');
      const { totalScore } = useMatchScore(profile, jobData);
      
      console.log('\n=== Match Score Analysis ===');
      console.log(`Total Match Score: ${(totalScore * 100).toFixed(1)}%`);
      console.log('Profile:', {
        title: profile.job_title,
        experience: profile.years_experience,
        location: profile.location,
        skills: profile.required_skills
      });
      console.log('Job:', {
        title: jobData.title,
        minExperience: jobData.min_years_experience,
        location: jobData.location,
        requiredSkills: jobData.required_skills
      });
    }

    return {
      employerEmail: 'test.employer@example.com',
      candidateEmail: 'test.candidate@example.com',
      password: 'testpass123'
    };

  } catch (error) {
    console.error('Error setting up test scenario:', error);
    throw error;
  }
};

