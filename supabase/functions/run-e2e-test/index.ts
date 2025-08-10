import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json", ...corsHeaders },
    ...init,
  });
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("run-e2e-test: Missing Supabase env configuration", { hasUrl: !!supabaseUrl, hasKey: !!serviceRoleKey });
    return jsonResponse({ ok: false, error: "Missing Supabase env configuration" }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);

  const startedAt = Date.now();
  const suffix = Date.now();
  const password = "Testpass123!";

  // Entities we will create and then clean up
  const created: any = {
    users: [] as string[],
    jobId: null as number | null,
    recommendationId: null as number | null,
    interviewSlotIds: [] as string[],
    interviewIds: [] as number[],
    bonusPaymentIds: [] as number[],
    pushNotificationIds: [] as number[],
  };

  const result: Record<string, string> = {};

  try {
    console.log("run-e2e-test: starting");

    // 1) Create users (employer, candidate, VR, VR-candidate)
    const createUser = async (email: string, user_type: "employer" | "candidate" | "vr", full_name: string) => {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { user_type, full_name },
      });
      if (error || !data.user) throw error || new Error("No user returned");
      created.users.push(data.user.id);
      return data.user.id;
    };

    const employerEmail = `e2e.employer+${suffix}@example.com`;
    const candidateEmail = `e2e.candidate+${suffix}@example.com`;
    const vrCandidateEmail = `e2e.vr.candidate+${suffix}@example.com`;
    const vrEmail = `e2e.vr+${suffix}@example.com`;

    const employerId = await createUser(employerEmail, "employer", "E2E Employer");
    result.employer = employerEmail;
    const candidateId = await createUser(candidateEmail, "candidate", "E2E Candidate");
    result.candidate = candidateEmail;
    const vrCandidateId = await createUser(vrCandidateEmail, "candidate", "E2E VR Candidate");
    result.vrCandidate = vrCandidateEmail;
    const vrId = await createUser(vrEmail, "vr", "E2E Connector");
    result.vr = vrEmail;

    // 2) Create profiles (minimal fields used by app)
    const { error: empProfErr } = await admin
      .from("employer_profiles")
      .insert({
        id: employerId,
        company_name: "E2E Tech Ltd [TEMP]",
        full_name: "E2E Employer",
        job_title: "HR Director",
        company_website: "https://example.com",
        linkedin_url: "https://linkedin.com/company/example",
        company_size: 50,
        is_sme: true,
      });
    if (empProfErr) throw empProfErr;

    const insertCandidate = async (id: string, email: string, fullName: string, yrs = 5) => {
      const { error } = await admin.from("candidate_profiles").insert({
        id,
        email,
        full_name: fullName,
        job_title: "Frontend Developer",
        years_experience: yrs,
        min_salary: 35000,
        max_salary: 45000,
        location: ["Bristol"],
        required_skills: ["React", "TypeScript", "CSS"],
        workArea: "IT",
        itSpecialization: "Frontend Development",
      } as any);
      if (error) throw error;
    };
    await insertCandidate(candidateId, candidateEmail, "E2E Candidate", 5);
    await insertCandidate(vrCandidateId, vrCandidateEmail, "E2E VR Candidate", 6);

    // VR profile (minimal)
    const { error: vrProfErr } = await admin.from("virtual_recruiter_profiles").insert({
      id: vrId,
      full_name: "E2E Connector",
      email: vrEmail,
      location: "Remote",
      is_active: true,
    } as any);
    if (vrProfErr) throw vrProfErr;

    // 3) Create job
    const { data: job, error: jobErr } = await admin
      .from("jobs")
      .insert({
        employer_id: employerId,
        title: "Frontend Developer",
        company: "E2E Tech Ltd [TEMP]",
        description: "Temporary job for automated end-to-end test.",
        location: "Bristol",
        salary_min: 38000,
        salary_max: 42000,
        type: "Full-time",
        work_area: "IT",
        specialization: "Frontend Development",
        required_skills: ["React", "JavaScript", "TypeScript", "CSS"],
        holiday_entitlement: 25,
        company_benefits: "Health insurance, flexible working, annual bonus",
        candidate_commission: 2400,
        match_threshold: 70,
      })
      .select()
      .single();
    if (jobErr || !job) throw jobErr || new Error("Job insert failed");
    created.jobId = job.id;

    // 4) Direct application
    const { error: appErr } = await admin.from("applications").insert({
      job_id: job.id,
      applicant_id: candidateId,
      status: "pending",
      profile_visibility_enabled: true,
    });
    if (appErr) throw appErr;

    // 5) VR recommendation for VR candidate
    const { data: rec, error: recErr } = await admin
      .from("candidate_recommendations")
      .insert({
        vr_id: vrId,
        candidate_email: vrCandidateEmail,
        job_id: job.id,
        status: "pending",
        notes: "Automated test recommendation",
      })
      .select()
      .single();
    if (recErr || !rec) throw recErr || new Error("Recommendation insert failed");
    created.recommendationId = rec.id;

    // 6) Interview slots for both
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data: slot1, error: slot1Err } = await admin
      .from("interview_slots")
      .insert({
        employer_id: employerId,
        candidate_id: candidateId,
        job_id: job.id,
        proposed_times: [tomorrow.toISOString()],
        status: "pending",
      })
      .select()
      .single();
    if (slot1Err || !slot1) throw slot1Err || new Error("Interview slot (direct) failed");
    created.interviewSlotIds.push(slot1.id);

    const { data: slot2, error: slot2Err } = await admin
      .from("interview_slots")
      .insert({
        employer_id: employerId,
        candidate_id: vrCandidateId,
        job_id: job.id,
        proposed_times: [nextWeek.toISOString()],
        status: "pending",
      })
      .select()
      .single();
    if (slot2Err || !slot2) throw slot2Err || new Error("Interview slot (vr) failed");
    created.interviewSlotIds.push(slot2.id);

    // 7) Accept slots -> create interviews
    const { error: accept1Err } = await admin
      .from("interview_slots")
      .update({ status: "accepted", selected_time: slot1.proposed_times[0] })
      .eq("id", slot1.id);
    if (accept1Err) throw accept1Err;

    const { error: accept2Err } = await admin
      .from("interview_slots")
      .update({ status: "accepted", selected_time: slot2.proposed_times[0] })
      .eq("id", slot2.id);
    if (accept2Err) throw accept2Err;

    const { error: int1Err } = await admin.from("interviews").insert({
      job_id: job.id,
      candidate_id: candidateId,
      employer_id: employerId,
      interviewer_name: "Jane Smith",
      scheduled_at: slot1.proposed_times[0],
      status: "scheduled",
    });
    if (int1Err) throw int1Err;

    const { error: int2Err } = await admin.from("interviews").insert({
      job_id: job.id,
      candidate_id: vrCandidateId,
      employer_id: employerId,
      interviewer_name: "John Doe",
      scheduled_at: slot2.proposed_times[0],
      status: "scheduled",
    });
    if (int2Err) throw int2Err;

    // 8) Offer to VR candidate
    const { error: offerErr } = await admin
      .from("applications")
      .update({ status: "offered" })
      .eq("job_id", job.id)
      .eq("applicant_id", vrCandidateId);
    if (offerErr) throw offerErr;

    // 9) Accept offer + commission setup (60/40)
    const total = 2400;
    const vrCommission = Math.round(total * 0.6);
    const candCommission = total - vrCommission;

    const startDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const dueDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { error: acceptErr } = await admin
      .from("applications")
      .update({ status: "accepted", candidate_accepted: true, employer_accepted: true })
      .eq("job_id", job.id)
      .eq("applicant_id", vrCandidateId);
    if (acceptErr) throw acceptErr;

    const { data: bonus, error: bonusErr } = await admin
      .from("bonus_payments")
      .insert({
        job_id: job.id,
        candidate_id: vrCandidateId,
        employer_id: employerId,
        recommendation_id: created.recommendationId,
        vr_id: vrId,
        candidate_commission: candCommission,
        vr_commission: vrCommission,
        start_date: startDate.toISOString(),
        payment_due_date: dueDate.toISOString(),
        payment_status: "pending",
      })
      .select()
      .single();
    if (bonusErr || !bonus) throw bonusErr || new Error("Bonus creation failed");

    result.summary = "E2E flow completed successfully (created -> offer -> acceptance -> commission).";

    // Always clean up to avoid any test data appearing in UI
    const cleanup = async () => {
      try {
        await admin.from("bonus_payments").delete().eq("job_id", job.id);
        await admin.from("interviews").delete().eq("job_id", job.id);
        await admin.from("interview_slots").delete().eq("job_id", job.id);
        await admin.from("push_notifications").delete().eq("related_entity_id", job.id.toString());
        await admin.from("candidate_recommendations").delete().eq("job_id", job.id);
        await admin.from("applications").delete().eq("job_id", job.id);
        await admin.from("jobs").delete().eq("id", job.id);
        await admin.from("candidate_profiles").delete().in("id", [candidateId, vrCandidateId]);
        await admin.from("virtual_recruiter_profiles").delete().eq("id", vrId);
        await admin.from("employer_profiles").delete().eq("id", employerId);
        await admin.from("user_roles").delete().in("user_id", [employerId, candidateId, vrCandidateId, vrId]);
        // Finally delete users
        await admin.auth.admin.deleteUser(employerId);
        await admin.auth.admin.deleteUser(candidateId);
        await admin.auth.admin.deleteUser(vrCandidateId);
        await admin.auth.admin.deleteUser(vrId);
      } catch (e) {
        console.error("Cleanup error", e);
      }
    };

    await cleanup();

    const ms = Date.now() - startedAt;
    console.log("run-e2e-test: finished in", ms, "ms");
    return jsonResponse({ ok: true, duration_ms: ms, ...result });
  } catch (error: any) {
    console.error("run-e2e-test error", error);
    return jsonResponse({ ok: false, error: String(error?.message || error) }, { status: 500 });
  }
});
