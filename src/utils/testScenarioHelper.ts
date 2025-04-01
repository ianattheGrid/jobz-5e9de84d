
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
  const { data: directSlotData, error: directSlotError } = await supabase.from('interview_slots').insert({
    employer_id: employerId,
    candidate_id: candidateId,
    job_id: jobId,
    proposed_times: [
      tomorrow.toISOString(),
      dayAfterTomorrow.toISOString()
    ],
    status: 'pending'
  }).select().single();
  
  if (directSlotError) {
    console.error("Error creating interview slot for direct candidate:", directSlotError);
    throw directSlotError;
  }

  // For VR recommended candidate
  const { data: vrSlotData, error: vrSlotError } = await supabase.from('interview_slots').insert({
    employer_id: employerId,
    candidate_id: vrCandidateId,
    job_id: jobId,
    proposed_times: [
      tomorrow.toISOString(),
      nextWeek.toISOString()
    ],
    status: 'pending'
  }).select().single();
  
  if (vrSlotError) {
    console.error("Error creating interview slot for VR candidate:", vrSlotError);
    throw vrSlotError;
  }

  return { directSlotData, vrSlotData };
};

/**
 * Simulate candidate rejecting interview times
 */
const rejectInterviewSlots = async (directSlotId: string, vrSlotId: string) => {
  // Direct candidate rejects with a message
  const { error: directRejectError } = await supabase.from('interview_slots')
    .update({
      status: 'pending',
      candidate_message: 'Sorry, I cannot make these times. Could we schedule for next week instead?',
      candidate_suggested_times: [
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString()
      ]
    })
    .eq('id', directSlotId);
  
  if (directRejectError) {
    console.error("Error rejecting direct interview slot:", directRejectError);
    throw directRejectError;
  }

  // VR candidate rejects and suggests new times
  const { error: vrRejectError } = await supabase.from('interview_slots')
    .update({
      status: 'pending',
      candidate_message: 'These times don\'t work for me. I\'m available later in the week.',
      candidate_suggested_times: [
        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
      ]
    })
    .eq('id', vrSlotId);
  
  if (vrRejectError) {
    console.error("Error rejecting VR interview slot:", vrRejectError);
    throw vrRejectError;
  }
};

/**
 * Reschedule interview slots based on candidate suggestions
 */
const rescheduleInterviewSlots = async (directSlotId: string, vrSlotId: string) => {
  // Get candidate suggested times
  const { data: directSlot, error: directFetchError } = await supabase
    .from('interview_slots')
    .select('candidate_suggested_times')
    .eq('id', directSlotId)
    .single();
  
  if (directFetchError) {
    console.error("Error fetching direct interview slot:", directFetchError);
    throw directFetchError;
  }

  const { data: vrSlot, error: vrFetchError } = await supabase
    .from('interview_slots')
    .select('candidate_suggested_times')
    .eq('id', vrSlotId)
    .single();
  
  if (vrFetchError) {
    console.error("Error fetching VR interview slot:", vrFetchError);
    throw vrFetchError;
  }

  // Reschedule direct candidate interview
  const { error: directRescheduleError } = await supabase
    .from('interview_slots')
    .update({
      proposed_times: directSlot.candidate_suggested_times,
      status: 'pending',
      candidate_message: null,
      candidate_suggested_times: null
    })
    .eq('id', directSlotId);
  
  if (directRescheduleError) {
    console.error("Error rescheduling direct interview slot:", directRescheduleError);
    throw directRescheduleError;
  }

  // Reschedule VR candidate interview
  const { error: vrRescheduleError } = await supabase
    .from('interview_slots')
    .update({
      proposed_times: vrSlot.candidate_suggested_times,
      status: 'pending',
      candidate_message: null,
      candidate_suggested_times: null
    })
    .eq('id', vrSlotId);
  
  if (vrRescheduleError) {
    console.error("Error rescheduling VR interview slot:", vrRescheduleError);
    throw vrRescheduleError;
  }
};

/**
 * Accept rescheduled interview slots
 */
const acceptInterviewSlots = async (directSlotId: string, vrSlotId: string) => {
  // Get rescheduled times
  const { data: directSlot, error: directFetchError } = await supabase
    .from('interview_slots')
    .select('proposed_times')
    .eq('id', directSlotId)
    .single();
  
  if (directFetchError) {
    console.error("Error fetching direct interview slot:", directFetchError);
    throw directFetchError;
  }

  const { data: vrSlot, error: vrFetchError } = await supabase
    .from('interview_slots')
    .select('proposed_times')
    .eq('id', vrSlotId)
    .single();
  
  if (vrFetchError) {
    console.error("Error fetching VR interview slot:", vrFetchError);
    throw vrFetchError;
  }

  // Direct candidate accepts first proposed time
  const { error: directAcceptError } = await supabase
    .from('interview_slots')
    .update({
      status: 'accepted',
      selected_time: directSlot.proposed_times[0]
    })
    .eq('id', directSlotId);
  
  if (directAcceptError) {
    console.error("Error accepting direct interview slot:", directAcceptError);
    throw directAcceptError;
  }

  // VR candidate accepts first proposed time
  const { error: vrAcceptError } = await supabase
    .from('interview_slots')
    .update({
      status: 'accepted',
      selected_time: vrSlot.proposed_times[0]
    })
    .eq('id', vrSlotId);
  
  if (vrAcceptError) {
    console.error("Error accepting VR interview slot:", vrAcceptError);
    throw vrAcceptError;
  }

  // Create actual interview records
  const { data: interviews, error: interviewError } = await Promise.all([
    supabase.from('interviews').insert({
      job_id: directSlot.job_id,
      candidate_id: directSlot.candidate_id,
      employer_id: directSlot.employer_id,
      interviewer_name: 'Jane Smith',
      scheduled_at: directSlot.proposed_times[0],
      status: 'scheduled'
    }),
    supabase.from('interviews').insert({
      job_id: vrSlot.job_id,
      candidate_id: vrSlot.candidate_id,
      employer_id: vrSlot.employer_id,
      interviewer_name: 'John Doe',
      scheduled_at: vrSlot.proposed_times[0],
      status: 'scheduled'
    })
  ]);
  
  if (interviewError) {
    console.error("Error creating interview records:", interviewError);
    throw interviewError;
  }
};

/**
 * Make job offer to VR-recommended candidate
 */
const makeJobOfferToVRCandidate = async (jobId: number, vrCandidateId: string) => {
  // Update application status to offered
  const { error: appError } = await supabase
    .from('applications')
    .update({
      status: 'offered'
    })
    .eq('job_id', jobId)
    .eq('applicant_id', vrCandidateId);
  
  if (appError) {
    console.error("Error updating application status:", appError);
    throw appError;
  }
  
  // Create notification for the candidate
  const { error: notifyError } = await supabase.from('push_notifications').insert({
    user_id: vrCandidateId,
    type: 'job_offer',
    title: 'Job Offer Received',
    message: 'Congratulations! You have received a job offer for the Frontend Developer position.',
    related_entity_id: jobId.toString()
  });
  
  if (notifyError) {
    console.error("Error creating candidate notification:", notifyError);
    throw notifyError;
  }
  
  // Get the recommendation ID for this VR candidate
  const { data: recommendation, error: recError } = await supabase
    .from('candidate_recommendations')
    .select('id, vr_id')
    .eq('job_id', jobId)
    .eq('candidate_email', vrCandidateId) // This assumes the email is same as the ID
    .single();
  
  if (recError) {
    console.error("Error fetching recommendation:", recError);
    throw recError;
  }
  
  // Update recommendation status
  const { error: recUpdateError } = await supabase
    .from('candidate_recommendations')
    .update({
      status: 'offered'
    })
    .eq('id', recommendation.id);
    
  if (recUpdateError) {
    console.error("Error updating recommendation status:", recUpdateError);
    throw recUpdateError;
  }
    
  // Notify VR about the offer
  const { error: vrNotifyError } = await supabase.from('push_notifications').insert({
    user_id: recommendation.vr_id,
    type: 'vr_candidate_update',
    title: 'Your Candidate Received an Offer',
    message: 'Your recommended candidate has received a job offer for the Frontend Developer position. You will earn commission when they start.',
    related_entity_id: recommendation.id.toString()
  });
  
  if (vrNotifyError) {
    console.error("Error creating VR notification:", vrNotifyError);
    throw vrNotifyError;
  }
};

/**
 * Accept job offer and set up commission
 */
const acceptJobOfferAndSetupCommission = async (jobId: number, candidateId: string, recommendationId: number) => {
  // Get job and employer details
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('employer_id, candidate_commission')
    .eq('id', jobId)
    .single();
  
  if (jobError) {
    console.error("Error fetching job:", jobError);
    throw jobError;
  }
  
  // Get recommendation details
  const { data: recommendation, error: recError } = await supabase
    .from('candidate_recommendations')
    .select('vr_id, commission_percentage')
    .eq('id', recommendationId)
    .single();
  
  if (recError) {
    console.error("Error fetching recommendation:", recError);
    throw recError;
  }
  
  // Calculate commissions
  const totalCommission = job.candidate_commission;
  const vrCommission = Math.round(totalCommission * (recommendation.commission_percentage / 100));
  const candidateCommission = totalCommission - vrCommission;
  
  // Update application status to accepted
  const { error: appError } = await supabase
    .from('applications')
    .update({
      status: 'accepted',
      candidate_accepted: true,
      employer_accepted: true
    })
    .eq('job_id', jobId)
    .eq('applicant_id', candidateId);
  
  if (appError) {
    console.error("Error updating application status:", appError);
    throw appError;
  }
  
  // Create start date (2 weeks from now)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 14);
  
  // Create payment due date (30 days after start)
  const paymentDueDate = new Date(startDate);
  paymentDueDate.setDate(paymentDueDate.getDate() + 30);
  
  // Create bonus payment record
  const { error: paymentError } = await supabase.from('bonus_payments').insert({
    job_id: jobId,
    candidate_id: candidateId,
    employer_id: job.employer_id,
    recommendation_id: recommendationId,
    vr_id: recommendation.vr_id,
    candidate_commission: candidateCommission,
    vr_commission: vrCommission,
    start_date: startDate.toISOString(),
    payment_due_date: paymentDueDate.toISOString(),
    payment_status: 'pending',
    confirmed_at: new Date().toISOString()
  });
  
  if (paymentError) {
    console.error("Error creating bonus payment:", paymentError);
    throw paymentError;
  }
  
  // Notify all parties
  await Promise.all([
    // Notify candidate
    supabase.from('push_notifications').insert({
      user_id: candidateId,
      type: 'bonus_payment',
      title: 'Bonus Payment Confirmed',
      message: `Your £${candidateCommission} hiring bonus has been confirmed. Payment is due in 30 days after you start.`,
      related_entity_id: jobId.toString()
    }),
    // Notify VR
    supabase.from('push_notifications').insert({
      user_id: recommendation.vr_id,
      type: 'vr_commission',
      title: 'Commission Confirmed',
      message: `Your £${vrCommission} commission has been confirmed for your recommended candidate. Payment is due in 30 days after the candidate starts.`,
      related_entity_id: recommendationId.toString()
    }),
    // Notify employer
    supabase.from('push_notifications').insert({
      user_id: job.employer_id,
      type: 'payment_due',
      title: 'Bonus Payment Due',
      message: `A bonus payment of £${totalCommission} will be due 30 days after the candidate's start date.`,
      related_entity_id: jobId.toString()
    })
  ]);
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
    const interviewSlots = await createInterviewSlots(employerId, candidateId, vrCandidateId, jobData.id);

    // 6. Simulate candidates rejecting interview times and suggesting alternatives
    await rejectInterviewSlots(interviewSlots.directSlotData.id, interviewSlots.vrSlotData.id);
    
    // 7. Employer reschedules interviews
    await rescheduleInterviewSlots(interviewSlots.directSlotData.id, interviewSlots.vrSlotData.id);
    
    // 8. Candidates accept rescheduled interviews
    await acceptInterviewSlots(interviewSlots.directSlotData.id, interviewSlots.vrSlotData.id);
    
    // 9. Employer makes job offer to VR-recommended candidate
    await makeJobOfferToVRCandidate(jobData.id, vrCandidateId);
    
    // 10. VR candidate accepts job offer and commission is set up
    await acceptJobOfferAndSetupCommission(jobData.id, vrCandidateId, recommendationData.id);

    console.log('Enhanced test scenario created successfully with the following accounts:');
    console.log('Employer:', credentials.employerEmail, '/ password:', credentials.password);
    console.log('Direct Candidate:', credentials.candidateEmail, '/ password:', credentials.password);
    console.log('VR Candidate:', credentials.vrCandidateEmail, '/ password:', credentials.password);
    console.log('VR:', credentials.vrEmail, '/ password:', credentials.password);
    console.log('Job ID:', jobData.id);
    console.log('Recommendation ID:', recommendationData.id);
    console.log('Interview slots were rejected, rescheduled, and accepted');
    console.log('Job offer was made to the VR candidate and accepted');
    console.log('Commission was set up: 60% to VR, 40% to candidate');

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
