
import { supabase } from "@/integrations/supabase/client";

export const setupTestScenario = async () => {
  try {
    // 1. Create test employer account
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

    // Create employer profile
    await supabase.from('employer_profiles').insert({
      id: employerData.user?.id,
      company_name: 'Test Company Ltd',
      full_name: 'Test Employer',
      job_title: 'HR Manager'
    });

    // 2. Create test candidate account
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
      full_name: 'Test Candidate',
      job_title: 'Software Engineer',
      years_experience: 5,
      min_salary: 50000,
      max_salary: 80000,
      location: ['Bristol'],
      required_skills: ['React', 'TypeScript'],
      work_eligibility: 'UK citizens only'
    });

    // 3. Create test VR account
    const { data: vrData, error: vrError } = await supabase.auth.signUp({
      email: 'test.vr@example.com',
      password: 'testpass123',
      options: {
        data: {
          user_type: 'vr',
          full_name: 'Test VR',
        }
      }
    });

    if (vrError) throw vrError;

    // Create VR profile - Note: vr_number is generated automatically by DB trigger
    await supabase.from('virtual_recruiter_profiles').insert({
      email: 'test.vr@example.com',
      full_name: 'Test VR',
      location: 'Bristol',
      id: vrData.user?.id
    });

    // 4. Create a test job posting
    const { data: jobData, error: jobError } = await supabase.from('jobs').insert({
      employer_id: employerData.user?.id,
      title: 'Senior Software Engineer',
      company: 'Test Company Ltd',
      description: 'Looking for a skilled software engineer...',
      location: 'Bristol',
      salary_min: 50000,
      salary_max: 80000,
      type: 'Full-time',
      work_area: 'Software Engineer',
      specialization: 'Frontend',
      required_skills: ['React', 'TypeScript'],
      holiday_entitlement: 25,
      company_benefits: 'Health insurance, flexible working',
      candidate_commission: 5000
    }).select().single();

    if (jobError) throw jobError;

    // 5. Submit a test application
    await supabase.from('applications').insert({
      job_id: jobData.id,
      applicant_id: candidateData.user?.id,
      resume_url: 'https://example.com/test-cv.pdf',
      cover_letter: 'I am very interested in this position...',
      status: 'pending'
    });

    // 6. Create a VR recommendation
    await supabase.from('candidate_recommendations').insert({
      vr_id: vrData.user?.id,
      job_id: jobData.id,
      candidate_email: 'recommended.candidate@example.com',
      candidate_phone: '+44123456789',
      status: 'pending'
    });

    // 7. Create interview slots
    await supabase.from('interview_slots').insert({
      employer_id: employerData.user?.id,
      candidate_id: candidateData.user?.id,
      job_id: jobData.id,
      proposed_times: [
        new Date(Date.now() + 86400000).toISOString(), // tomorrow
        new Date(Date.now() + 172800000).toISOString()  // day after tomorrow
      ],
      status: 'pending'
    });

    return {
      employerEmail: 'test.employer@example.com',
      candidateEmail: 'test.candidate@example.com',
      vrEmail: 'test.vr@example.com',
      password: 'testpass123'
    };

  } catch (error) {
    console.error('Error setting up test scenario:', error);
    throw error;
  }
};
