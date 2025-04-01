
import { supabase } from "@/integrations/supabase/client";
import { createVRProfile } from "@/utils/profile-creation/createVRProfile";
import { Json } from "@/integrations/supabase/types";

export const setupTestScenario = async () => {
  try {
    // Generate unique email addresses with timestamps to avoid collisions
    const timestamp = new Date().getTime();
    const employerEmail = `test.employer${timestamp}@example.com`;
    const candidateEmail = `test.candidate${timestamp}@example.com`;
    const vrCandidateEmail = `vr.candidate${timestamp}@example.com`;
    const vrEmail = `test.vr${timestamp}@example.com`;
    const password = 'testpass123';
    
    console.log("Creating test accounts with unique emails:", {
      employer: employerEmail,
      candidate: candidateEmail,
      vrCandidate: vrCandidateEmail,
      vr: vrEmail
    });

    // 1. Create test employer account with comprehensive profile
    const { data: employerData, error: employerError } = await supabase.auth.signUp({
      email: employerEmail,
      password: password,
      options: {
        data: {
          user_type: 'employer',
          full_name: 'Test Employer',
          company_name: 'Tech Solutions Ltd'
        }
      }
    });
    
    if (employerError) {
      console.error("Error creating employer account:", employerError);
      throw employerError;
    }
    
    if (!employerData.user?.id) {
      throw new Error("Failed to create employer account: No user ID returned");
    }

    // Create user role for employer
    await supabase.from('user_roles').insert({
      user_id: employerData.user.id,
      role: 'employer'
    });

    // Create detailed employer profile
    await supabase.from('employer_profiles').insert({
      id: employerData.user.id,
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
      email: candidateEmail,
      password: password,
      options: {
        data: {
          user_type: 'candidate',
          full_name: 'Test Candidate',
        }
      }
    });

    if (candidateError) {
      console.error("Error creating candidate account:", candidateError);
      throw candidateError;
    }
    
    if (!candidateData.user?.id) {
      throw new Error("Failed to create candidate account: No user ID returned");
    }

    // Create user role for direct candidate
    await supabase.from('user_roles').insert({
      user_id: candidateData.user.id,
      role: 'candidate'
    });

    // Create candidate profile
    await supabase.from('candidate_profiles').insert({
      id: candidateData.user.id,
      email: candidateEmail,
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
      email: vrCandidateEmail,
      password: password,
      options: {
        data: {
          user_type: 'candidate',
          full_name: 'VR Recommended Candidate',
        }
      }
    });

    if (vrCandidateError) {
      console.error("Error creating VR candidate account:", vrCandidateError);
      throw vrCandidateError;
    }
    
    if (!vrCandidateData.user?.id) {
      throw new Error("Failed to create VR candidate account: No user ID returned");
    }

    // Create user role for VR candidate
    await supabase.from('user_roles').insert({
      user_id: vrCandidateData.user.id,
      role: 'candidate'
    });

    // Create VR candidate profile
    await supabase.from('candidate_profiles').insert({
      id: vrCandidateData.user.id,
      email: vrCandidateEmail,
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
      email: vrEmail,
      password: password,
      options: {
        data: {
          user_type: 'vr',
          full_name: 'Test Recruiter',
        }
      }
    });

    if (vrError) {
      console.error("Error creating VR account:", vrError);
      throw vrError;
    }
    
    if (!vrData.user?.id) {
      throw new Error("Failed to create VR account: No user ID returned");
    }

    // Create user role for VR
    await supabase.from('user_roles').insert({
      user_id: vrData.user.id,
      role: 'vr'
    });

    // Use the createVRProfile function to create the VR profile with proper vr_number generation
    const vrProfileResult = await createVRProfile(vrData.user.id, 'Test Recruiter', vrEmail);
    if (!vrProfileResult) {
      console.error("Error creating VR profile");
      throw new Error("Failed to create VR profile");
    }

    // 5. Create a test job with £40,000 salary and 6% commission (60% VR, 40% candidate)
    const { data: jobData, error: jobError } = await supabase.from('jobs').insert({
      employer_id: employerData.user.id,
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

    if (jobError) {
      console.error("Error creating job:", jobError);
      throw jobError;
    }
    
    if (!jobData) {
      throw new Error("Failed to create job: No job data returned");
    }

    // 6. Create direct application from candidate
    const { error: applicationError } = await supabase.from('applications').insert({
      job_id: jobData.id,
      applicant_id: candidateData.user.id,
      status: 'pending',
      profile_visibility_enabled: true
    });

    if (applicationError) {
      console.error("Error creating application:", applicationError);
      throw applicationError;
    }

    // 7. Create VR recommendation for VR candidate
    const { data: recommendationData, error: recommendationError } = await supabase.from('candidate_recommendations').insert({
      vr_id: vrData.user.id,
      candidate_email: vrCandidateEmail,
      job_id: jobData.id,
      status: 'pending',
      recommendation_type: 'job_specific',
      commission_percentage: 60, // 60% of the commission goes to the VR
      notes: 'Strong candidate with excellent React skills'
    }).select().single();

    if (recommendationError) {
      console.error("Error creating recommendation:", recommendationError);
      throw recommendationError;
    }
    
    if (!recommendationData) {
      throw new Error("Failed to create recommendation: No data returned");
    }

    // 8. Create interview slots for both candidates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // For direct candidate
    const { error: directSlotError } = await supabase.from('interview_slots').insert({
      employer_id: employerData.user.id,
      candidate_id: candidateData.user.id,
      job_id: jobData.id,
      proposed_times: [
        tomorrow.toISOString(),
        dayAfterTomorrow.toISOString()
      ],
      status: 'pending'
    });
    
    if (directSlotError) {
      console.error("Error creating interview slot for direct candidate:", directSlotError);
      throw directSlotError;
    }

    // For VR recommended candidate
    const { error: vrSlotError } = await supabase.from('interview_slots').insert({
      employer_id: employerData.user.id,
      candidate_id: vrCandidateData.user.id,
      job_id: jobData.id,
      proposed_times: [
        tomorrow.toISOString(),
        nextWeek.toISOString()
      ],
      status: 'pending'
    });
    
    if (vrSlotError) {
      console.error("Error creating interview slot for VR candidate:", vrSlotError);
      throw vrSlotError;
    }

    console.log('Test scenario created successfully with the following accounts:');
    console.log('Employer:', employerEmail, '/ password:', password);
    console.log('Direct Candidate:', candidateEmail, '/ password:', password);
    console.log('VR Candidate:', vrCandidateEmail, '/ password:', password);
    console.log('VR:', vrEmail, '/ password:', password);
    console.log('Job ID:', jobData.id);
    console.log('Recommendation ID:', recommendationData.id);

    return {
      employerEmail,
      candidateEmail,
      vrCandidateEmail,
      vrEmail,
      password,
      jobId: jobData.id,
      recommendationId: recommendationData.id
    };

  } catch (error) {
    console.error('Error setting up test scenario:', error);
    throw error;
  }
};
