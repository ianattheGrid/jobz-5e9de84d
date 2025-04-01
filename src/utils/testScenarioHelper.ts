
import { supabase } from "@/integrations/supabase/client";
import { createVRProfile } from "@/utils/profile-creation/createVRProfile";
import { Json } from "@/integrations/supabase/types";

/**
 * Generate unique test email addresses to avoid collisions
 */
const generateTestEmails = () => {
  const timestamp = new Date().getTime();
  return {
    employerEmail: `test.employer${timestamp}@example.com`,
    candidateEmail: `test.candidate${timestamp}@example.com`,
    vrCandidateEmail: `vr.candidate${timestamp}@example.com`,
    vrEmail: `test.vr${timestamp}@example.com`,
    password: 'testpass123'
  };
};

/**
 * Create a test employer account with comprehensive profile
 */
const createEmployerAccount = async (email: string, password: string) => {
  const { data: employerData, error: employerError } = await supabase.auth.signUp({
    email: email,
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

  await createUserRole(employerData.user.id, 'employer');
  await createEmployerProfile(employerData.user.id);

  return employerData.user.id;
};

/**
 * Create user role for an account
 */
const createUserRole = async (userId: string, role: string) => {
  const { error } = await supabase.from('user_roles').insert({
    user_id: userId,
    role: role
  });

  if (error) {
    console.error(`Error creating ${role} user role:`, error);
    throw error;
  }
};

/**
 * Create a detailed employer profile
 */
const createEmployerProfile = async (userId: string) => {
  const { error } = await supabase.from('employer_profiles').insert({
    id: userId,
    company_name: 'Tech Solutions Ltd',
    full_name: 'Test Employer',
    job_title: 'HR Director',
    company_website: 'https://techsolutions.example.com',
    linkedin_url: 'https://linkedin.com/company/techsolutions',
    company_size: 150,
    is_sme: true
  });

  if (error) {
    console.error("Error creating employer profile:", error);
    throw error;
  }
};

/**
 * Create a test candidate account
 */
const createCandidateAccount = async (email: string, password: string, fullName: string, isVRCandidate = false) => {
  const { data: candidateData, error: candidateError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        user_type: 'candidate',
        full_name: fullName,
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

  await createUserRole(candidateData.user.id, 'candidate');
  await createCandidateProfile(candidateData.user.id, email, fullName, isVRCandidate);

  return candidateData.user.id;
};

/**
 * Create a candidate profile
 */
const createCandidateProfile = async (userId: string, email: string, fullName: string, isVRCandidate = false) => {
  const { error } = await supabase.from('candidate_profiles').insert({
    id: userId,
    email: email,
    full_name: fullName,
    job_title: 'Frontend Developer',
    years_experience: isVRCandidate ? 6 : 5,
    min_salary: 35000,
    max_salary: 45000,
    location: ['Bristol'],
    required_skills: isVRCandidate ? ['React', 'TypeScript', 'CSS', 'UI/UX'] : ['React', 'JavaScript', 'CSS'],
    workArea: 'IT',
    itSpecialization: 'Frontend Development'
  });

  if (error) {
    console.error("Error creating candidate profile:", error);
    throw error;
  }
};

/**
 * Create a Virtual Recruiter account
 */
const createVRAccount = async (email: string, password: string) => {
  const { data: vrData, error: vrError } = await supabase.auth.signUp({
    email: email,
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

  await createUserRole(vrData.user.id, 'vr');
  
  const vrProfileResult = await createVRProfile(vrData.user.id, 'Test Recruiter', email);
  if (!vrProfileResult) {
    console.error("Error creating VR profile");
    throw new Error("Failed to create VR profile");
  }

  return vrData.user.id;
};

/**
 * Create a test job
 */
const createTestJob = async (employerId: string) => {
  const { data: jobData, error: jobError } = await supabase.from('jobs').insert({
    employer_id: employerId,
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

  return jobData;
};

/**
 * Create a direct application from candidate
 */
const createDirectApplication = async (jobId: number, candidateId: string) => {
  const { error: applicationError } = await supabase.from('applications').insert({
    job_id: jobId,
    applicant_id: candidateId,
    status: 'pending',
    profile_visibility_enabled: true
  });

  if (applicationError) {
    console.error("Error creating application:", applicationError);
    throw applicationError;
  }
};

/**
 * Create a VR recommendation for a candidate
 */
const createVRRecommendation = async (vrId: string, candidateEmail: string, jobId: number) => {
  const { data: recommendationData, error: recommendationError } = await supabase.from('candidate_recommendations').insert({
    vr_id: vrId,
    candidate_email: candidateEmail,
    job_id: jobId,
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

  return recommendationData;
};

/**
 * Create interview slots for candidates
 */
const createInterviewSlots = async (employerId: string, candidateId: string, vrCandidateId: string, jobId: number) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  // For direct candidate
  const { error: directSlotError } = await supabase.from('interview_slots').insert({
    employer_id: employerId,
    candidate_id: candidateId,
    job_id: jobId,
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
    employer_id: employerId,
    candidate_id: vrCandidateId,
    job_id: jobId,
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
};

/**
 * Set up a complete test scenario with employer, candidates, VR, job, application and more
 */
export const setupTestScenario = async () => {
  try {
    // Generate unique test accounts
    const credentials = generateTestEmails();
    console.log("Creating test accounts with unique emails:", {
      employer: credentials.employerEmail,
      candidate: credentials.candidateEmail,
      vrCandidate: credentials.vrCandidateEmail,
      vr: credentials.vrEmail
    });

    // 1. Create test accounts
    const employerId = await createEmployerAccount(credentials.employerEmail, credentials.password);
    const candidateId = await createCandidateAccount(credentials.candidateEmail, credentials.password, 'Direct Applicant');
    const vrCandidateId = await createCandidateAccount(credentials.vrCandidateEmail, credentials.password, 'VR Recommended Candidate', true);
    const vrId = await createVRAccount(credentials.vrEmail, credentials.password);

    // 2. Create a test job
    const jobData = await createTestJob(employerId);

    // 3. Create direct application from candidate
    await createDirectApplication(jobData.id, candidateId);

    // 4. Create VR recommendation for VR candidate
    const recommendationData = await createVRRecommendation(vrId, credentials.vrCandidateEmail, jobData.id);

    // 5. Create interview slots for both candidates
    await createInterviewSlots(employerId, candidateId, vrCandidateId, jobData.id);

    console.log('Test scenario created successfully with the following accounts:');
    console.log('Employer:', credentials.employerEmail, '/ password:', credentials.password);
    console.log('Direct Candidate:', credentials.candidateEmail, '/ password:', credentials.password);
    console.log('VR Candidate:', credentials.vrCandidateEmail, '/ password:', credentials.password);
    console.log('VR:', credentials.vrEmail, '/ password:', credentials.password);
    console.log('Job ID:', jobData.id);
    console.log('Recommendation ID:', recommendationData.id);

    return {
      employerEmail: credentials.employerEmail,
      candidateEmail: credentials.candidateEmail,
      vrCandidateEmail: credentials.vrCandidateEmail,
      vrEmail: credentials.vrEmail,
      password: credentials.password,
      jobId: jobData.id,
      recommendationId: recommendationData.id
    };

  } catch (error) {
    console.error('Error setting up test scenario:', error);
    throw error;
  }
};
