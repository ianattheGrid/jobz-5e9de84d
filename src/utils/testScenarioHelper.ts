
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
          company_name: 'Tech Solutions Ltd'
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

    // 2. Create test direct candidate account
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

    // Create user role for direct candidate
    await supabase.from('user_roles').insert({
      user_id: candidateData.user?.id,
      role: 'candidate'
    });

    // Create candidate profile
    await supabase.from('candidate_profiles').insert({
      id: candidateData.user?.id,
      email: 'test.candidate@example.com',
      full_name: 'Direct Applicant',
      job_title: 'Frontend Developer',
      years_experience: 5,
      min_salary: 35000,
      max_salary: 45000,
      location: ['Bristol'],
      required_skills: ['React', 'JavaScript', 'CSS'],
      workArea: 'IT',
      itSpecialization: 'Frontend Development'
    });

    // 3. Create test VR candidate account (to be recommended by VR)
    const { data: vrCandidateData, error: vrCandidateError } = await supabase.auth.signUp({
      email: 'vr.candidate@example.com',
      password: 'testpass123',
      options: {
        data: {
          user_type: 'candidate',
          full_name: 'VR Recommended Candidate',
        }
      }
    });

    if (vrCandidateError) throw vrCandidateError;

    // Create user role for VR candidate
    await supabase.from('user_roles').insert({
      user_id: vrCandidateData.user?.id,
      role: 'candidate'
    });

    // Create VR candidate profile
    await supabase.from('candidate_profiles').insert({
      id: vrCandidateData.user?.id,
      email: 'vr.candidate@example.com',
      full_name: 'VR Recommended Candidate',
      job_title: 'Frontend Developer',
      years_experience: 6,
      min_salary: 38000,
      max_salary: 45000,
      location: ['Bristol'],
      required_skills: ['React', 'TypeScript', 'CSS', 'UI/UX'],
      workArea: 'IT',
      itSpecialization: 'Frontend Development'
    });
    
    // 4. Create a Virtual Recruiter account
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

    // Create VR profile
    await supabase.from('virtual_recruiter_profiles').insert({
      id: vrData.user?.id,
      vr_number: 'VR-12345',
      full_name: 'Test Recruiter',
      email: 'test.vr@example.com',
      location: 'Bristol',
      is_active: true
    });

    // 5. Create a test job with £40,000 salary and 6% commission (60% VR, 40% candidate)
    const { data: jobData, error: jobError } = await supabase.from('jobs').insert({
      employer_id: employerData.user?.id,
      title: 'Frontend Developer',
      company: 'Tech Solutions Ltd',
      description: 'We are looking for a skilled Frontend Developer with React experience to join our team...',
      location: 'Bristol',
      salary_min: 38000,
      salary_max: 42000,
      type: 'Full-time',
      work_area: 'IT',
      specialization: 'Frontend Development',
      required_skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
      holiday_entitlement: 25,
      company_benefits: 'Health insurance, flexible working, annual bonus',
      candidate_commission: 2400, // 6% of £40,000 = £2,400
      match_threshold: 70
    }).select().single();

    if (jobError) throw jobError;

    // 6. Create direct application from candidate
    const { error: applicationError } = await supabase.from('applications').insert({
      job_id: jobData?.id,
      applicant_id: candidateData.user?.id,
      status: 'pending',
      profile_visibility_enabled: true
    });

    if (applicationError) throw applicationError;

    // 7. Create VR recommendation for VR candidate
    const { data: recommendationData, error: recommendationError } = await supabase.from('candidate_recommendations').insert({
      vr_id: vrData.user?.id,
      candidate_email: 'vr.candidate@example.com',
      job_id: jobData?.id,
      status: 'pending',
      recommendation_type: 'job_specific',
      commission_percentage: 60, // 60% of the commission goes to the VR
      notes: 'Strong candidate with excellent React skills'
    }).select().single();

    if (recommendationError) throw recommendationError;

    // 8. Create interview slots for both candidates (will be rejected later)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // For direct candidate
    await supabase.from('interview_slots').insert({
      employer_id: employerData.user?.id,
      candidate_id: candidateData.user?.id,
      job_id: jobData?.id,
      proposed_times: [
        tomorrow.toISOString(),
        dayAfterTomorrow.toISOString()
      ],
      status: 'pending'
    });

    // For VR recommended candidate
    await supabase.from('interview_slots').insert({
      employer_id: employerData.user?.id,
      candidate_id: vrCandidateData.user?.id,
      job_id: jobData?.id,
      proposed_times: [
        tomorrow.toISOString(),
        nextWeek.toISOString()
      ],
      status: 'pending'
    });

    console.log('Test scenario created successfully with the following accounts:');
    console.log('Employer: test.employer@example.com / testpass123');
    console.log('Direct Candidate: test.candidate@example.com / testpass123');
    console.log('VR Candidate: vr.candidate@example.com / testpass123');
    console.log('VR: test.vr@example.com / testpass123');
    console.log('Job ID:', jobData?.id);
    console.log('Recommendation ID:', recommendationData?.id);

    return {
      employerEmail: 'test.employer@example.com',
      candidateEmail: 'test.candidate@example.com',
      vrCandidateEmail: 'vr.candidate@example.com',
      vrEmail: 'test.vr@example.com',
      password: 'testpass123',
      jobId: jobData?.id,
      recommendationId: recommendationData?.id
    };

  } catch (error) {
    console.error('Error setting up test scenario:', error);
    throw error;
  }
};
