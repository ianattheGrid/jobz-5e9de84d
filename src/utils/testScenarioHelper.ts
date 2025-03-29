
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

    // Create user role for employer
    await supabase.from('user_roles').insert({
      user_id: employerData.user?.id,
      role: 'employer'
    });

    // Create detailed employer profile
    await supabase.from('employer_profiles').insert({
      id: employerData.user?.id,
      company_name: 'Tech Solutions Ltd',
      full_name: 'Test Employer',
      job_title: 'HR Director',
      company_website: 'https://techsolutions.example.com',
      linkedin_url: 'https://linkedin.com/company/techsolutions',
      company_size: 150,
      is_sme: true
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

    // Create user role for candidate
    await supabase.from('user_roles').insert({
      user_id: candidateData.user?.id,
      role: 'candidate'
    });

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
      preferred_work_type: 'hybrid',
      workArea: 'IT',
      itSpecialization: 'Frontend Development'
    });

    // 3. Create a Virtual Recruiter account
    const { data: vrData, error: vrError } = await supabase.auth.signUp({
      email: 'test.vr@example.com',
      password: 'testpass123',
      options: {
        data: {
          user_type: 'vr',
          full_name: 'Test Recruiter',
        }
      }
    });

    if (vrError) throw vrError;

    // Create user role for VR
    await supabase.from('user_roles').insert({
      user_id: vrData.user?.id,
      role: 'vr'
    });

    // Create VR profile using RPC function
    const { error: vrProfileError } = await supabase.rpc('create_vr_profile', {
      user_id: vrData.user?.id,
      user_full_name: 'Test Recruiter',
      user_email: 'test.vr@example.com'
    });
    
    if (vrProfileError) throw vrProfileError;

    // 4. Create a detailed test job posting that should match well
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

    // Create a candidate recommendation from VR
    await supabase.from('candidate_recommendations').insert({
      vr_id: vrData.user?.id,
      candidate_email: 'test.candidate@example.com',
      job_id: jobData?.id,
      status: 'pending',
      recommendation_type: 'job_specific',
      commission_percentage: 5
    });

    console.log('Test scenario created successfully with the following accounts:');
    console.log('Employer: test.employer@example.com / testpass123');
    console.log('Candidate: test.candidate@example.com / testpass123');
    console.log('VR: test.vr@example.com / testpass123');
    console.log('Job ID:', jobData?.id);

    return {
      employerEmail: 'test.employer@example.com',
      candidateEmail: 'test.candidate@example.com',
      vrEmail: 'test.vr@example.com',
      password: 'testpass123',
      jobId: jobData?.id
    };

  } catch (error) {
    console.error('Error setting up test scenario:', error);
    throw error;
  }
};
