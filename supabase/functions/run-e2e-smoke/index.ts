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

// Minimal E2E "smoke" flow:
// Employer + Candidate -> profiles -> job -> direct application -> interview slot -> interview
// Skips Connector/VR, recommendations, and bonus/commission steps. Cleans up afterwards.
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("run-e2e-smoke: Missing Supabase env configuration", { hasUrl: !!supabaseUrl, hasKey: !!serviceRoleKey });
    return jsonResponse({ ok: false, error: "Missing Supabase env configuration" }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const startedAt = Date.now();
  const suffix = Date.now();
  const password = "Testpass123!";

  const created: any = {
    users: [] as string[],
    jobId: null as number | null,
    interviewSlotId: null as string | null,
  };

  try {
    console.log("run-e2e-smoke: starting");

    const createUser = async (email: string, user_type: "employer" | "candidate", full_name: string) => {
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

    const employerEmail = `smoke.employer+${suffix}@example.com`;
    const candidateEmail = `smoke.candidate+${suffix}@example.com`;

    const employerId = await createUser(employerEmail, "employer", "Smoke Employer");
    const candidateId = await createUser(candidateEmail, "candidate", "Smoke Candidate");

    // Employer profile (required non-null columns only)
    const { error: empErr } = await admin.from("employer_profiles").insert({
      id: employerId,
      company_name: "SmokeCo Ltd [TEMP]",
      full_name: "Smoke Employer",
      job_title: "HR Manager",
      company_website: "https://example.com",
    });
    if (empErr) throw empErr;

    // Candidate profile (respect required fields)
    const { error: candErr } = await admin.from("candidate_profiles").insert({
      id: candidateId,
      email: candidateEmail,
      full_name: "Smoke Candidate",
      job_title: "Frontend Developer",
      min_salary: 35000,
      max_salary: 45000,
      years_experience: 5,
      required_skills: ["React", "TypeScript"],
      location: ["Bristol"],
      workArea: "IT",
      itSpecialization: "Frontend Development",
    } as any);
    if (candErr) throw candErr;

    // Job
    const { data: job, error: jobErr } = await admin
      .from("jobs")
      .insert({
        employer_id: employerId,
        title: "Frontend Developer",
        company: "SmokeCo Ltd [TEMP]",
        description: "Temporary job for smoke test.",
        location: "Bristol",
        salary_min: 38000,
        salary_max: 42000,
        type: "Full-time",
        work_area: "IT",
        specialization: "Frontend Development",
        required_skills: ["React", "TypeScript"],
        holiday_entitlement: 25,
      })
      .select()
      .single();
    if (jobErr || !job) throw jobErr || new Error("Job insert failed");
    created.jobId = job.id;

    // Direct application
    const { error: appErr } = await admin.from("applications").insert({
      job_id: job.id,
      applicant_id: candidateId,
      status: "pending",
      profile_visibility_enabled: true,
    });
    if (appErr) throw appErr;

    // Interview slot
    const proposed = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { data: slot, error: slotErr } = await admin
      .from("interview_slots")
      .insert({
        employer_id: employerId,
        candidate_id: candidateId,
        job_id: job.id,
        proposed_times: [proposed],
        status: "pending",
      })
      .select()
      .single();
    if (slotErr || !slot) throw slotErr || new Error("Interview slot insert failed");
    created.interviewSlotId = slot.id;

    // Accept slot and create interview
    const { error: acceptErr } = await admin
      .from("interview_slots")
      .update({ status: "accepted", selected_time: slot.proposed_times[0] })
      .eq("id", slot.id);
    if (acceptErr) throw acceptErr;

    const { error: intErr } = await admin.from("interviews").insert({
      job_id: job.id,
      candidate_id: candidateId,
      employer_id: employerId,
      interviewer_name: "Jane Smith",
      scheduled_at: slot.proposed_times[0],
      status: "scheduled",
    });
    if (intErr) throw intErr;

    // Cleanup to keep DB tidy
    const cleanup = async () => {
      try {
        await admin.from("interviews").delete().eq("job_id", job.id);
        await admin.from("interview_slots").delete().eq("job_id", job.id);
        await admin.from("applications").delete().eq("job_id", job.id);
        await admin.from("jobs").delete().eq("id", job.id);
        await admin.from("candidate_profiles").delete().eq("id", candidateId);
        await admin.from("employer_profiles").delete().eq("id", employerId);
        await admin.from("user_roles").delete().in("user_id", [employerId, candidateId]);
        await admin.auth.admin.deleteUser(employerId);
        await admin.auth.admin.deleteUser(candidateId);
      } catch (e) {
        console.error("Smoke cleanup error", e);
      }
    };

    await cleanup();

    const ms = Date.now() - startedAt;
    console.log("run-e2e-smoke: finished in", ms, "ms");
    return jsonResponse({ ok: true, duration_ms: ms });
  } catch (error: any) {
    console.error("run-e2e-smoke error", error);
    return jsonResponse({ ok: false, error: String(error?.message || error) }, { status: 500 });
  }
});
