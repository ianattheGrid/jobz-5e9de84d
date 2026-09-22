// Nightly agent: builds the Bristol company list from the official Companies
// House register, postcode by postcode, keeping only actively trading
// companies big enough to hire. Companies only — no personal data, nothing
// emailed. Finding their website and careers page is the backfill job's work.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CH_KEY = Deno.env.get("COMPANIES_HOUSE_API_KEY");
const CH_API = "https://api.company-information.service.gov.uk";

const JOB_NAME = "fetch-companies-house";
const POSTCODES_PER_RUN = 3;
const PAGE_SIZE = 100;
const PAGES_PER_POSTCODE = 2;
const PROFILE_BUDGET = 60; // size checks per run
const BATCH_LIMIT = 40; // new companies added per run
const LOCK_MINUTES = 20;

const BRISTOL_POSTCODES = [
  "BS1", "BS2", "BS3", "BS4", "BS5", "BS6", "BS7", "BS8", "BS9", "BS10",
  "BS11", "BS13", "BS14", "BS15", "BS16", "BS20", "BS21", "BS22", "BS23",
  "BS24", "BS25", "BS26", "BS27", "BS28", "BS29", "BS30", "BS31", "BS32",
  "BS34", "BS35", "BS36", "BS37", "BS39", "BS40", "BS41", "BS48", "BS49",
];

// Recruitment, employment agencies and temp staffing — the middlemen.
const AGENCY_SIC = ["78100", "78101", "78109", "78200", "78300"];

// Only companies filing proper (medium or large) accounts are kept. Everything
// else — dormant, micro-entity, and the small-company exemptions like
// "total-exemption-full" and "unaudited-abridged" — is a firm below the
// 25-staff line as closely as the public record allows.
const BIG_ENOUGH = ["full", "group", "medium", "audited-abridged", "audit-exemption-subsidiary"];
const BAND_50_PLUS = ["full", "group", "medium"];

const NAME_AGENCY_WORDS = [
  "recruit", "resourcing", "staffing", "personnel", "headhunt", "employment agency",
  "manpower", "temping", "rec2rec",
];

function normalise(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** "SMITH & SONS LIMITED" reads better as "Smith & Sons". */
function tidyName(raw: string) {
  const cleaned = raw
    .replace(/\b(LIMITED|LTD\.?|PLC|LLP|L\.?L\.?P\.?)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return raw;
  if (cleaned === cleaned.toUpperCase()) {
    return cleaned
      .toLowerCase()
      .split(" ")
      .map((w) => (w.length > 2 ? w.charAt(0).toUpperCase() + w.slice(1) : w.toUpperCase()))
      .join(" ");
  }
  return cleaned;
}

async function ch(path: string) {
  const response = await fetch(`${CH_API}${path}`, {
    headers: { Authorization: `Basic ${btoa(`${CH_KEY}:`)}` },
  });
  if (!response.ok) {
    const err = new Error(`Companies House said ${response.status}`);
    (err as any).status = response.status;
    throw err;
  }
  return await response.json();
}

interface Candidate {
  name: string;
  number: string;
  postcode: string;
  town: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (!CH_KEY) {
    return new Response(JSON.stringify({ error: "Companies House key not set" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const now = new Date();

  const { data: lock } = await supabase
    .from("job_locks")
    .select("locked_until, paused_reason")
    .eq("job_name", JOB_NAME)
    .maybeSingle();

  if (lock?.paused_reason) {
    return new Response(JSON.stringify({ paused: lock.paused_reason }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (lock?.locked_until && new Date(lock.locked_until) > now) {
    return new Response(JSON.stringify({ skipped: "already running" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await supabase.from("job_locks").upsert(
    {
      job_name: JOB_NAME,
      locked_until: new Date(now.getTime() + LOCK_MINUTES * 60_000).toISOString(),
      last_run_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    { onConflict: "job_name" },
  );

  let added = 0;
  let tooSmall = 0;
  let agencies = 0;
  let looked = 0;
  let paused: string | null = null;

  try {
    // A few postcodes a night, rotating, so the whole city comes round.
    const night = now.getDate();
    const postcodes: string[] = [];
    for (let i = 0; i < POSTCODES_PER_RUN; i++) {
      postcodes.push(BRISTOL_POSTCODES[(night * POSTCODES_PER_RUN + i) % BRISTOL_POSTCODES.length]);
    }

    // What we already hold, so we never add the same company twice.
    const { data: known } = await supabase.from("target_companies").select("company_name");
    const knownNames = new Set((known ?? []).map((k: any) => normalise(k.company_name)));

    const candidates: Candidate[] = [];
    for (const postcode of postcodes) {
      for (let page = 0; page < PAGES_PER_POSTCODE; page++) {
        const query =
          `/advanced-search/companies?location=${encodeURIComponent(postcode)}` +
          `&company_status=active&size=${PAGE_SIZE}&start_index=${page * PAGE_SIZE}`;
        let payload: any;
        try {
          payload = await ch(query);
        } catch (error: any) {
          if ([401, 403, 429].includes(error?.status)) {
            paused = `Companies House said ${error.status}`;
            break;
          }
          continue;
        }

        const items = payload?.items ?? [];
        looked += items.length;
        for (const item of items) {
          const name: string = item?.company_name ?? "";
          if (!name) continue;
          const key = normalise(tidyName(name));
          if (knownNames.has(key)) continue;

          const sic: string[] = item?.sic_codes ?? [];
          const lower = name.toLowerCase();
          if (sic.some((c) => AGENCY_SIC.includes(c)) || NAME_AGENCY_WORDS.some((w) => lower.includes(w))) {
            agencies += 1;
            continue;
          }

          candidates.push({
            name: tidyName(name),
            number: item?.company_number ?? "",
            postcode: item?.registered_office_address?.postal_code ?? postcode,
            town: item?.registered_office_address?.locality ?? "Bristol",
          });
          knownNames.add(key);
        }
        if (items.length < PAGE_SIZE) break;
      }
      if (paused) break;
    }

    // Size check: ask the register what size accounts each one files.
    let profiles = 0;
    for (const candidate of candidates) {
      if (added >= BATCH_LIMIT || profiles >= PROFILE_BUDGET || paused) break;
      if (!candidate.number) continue;
      profiles += 1;

      let profile: any;
      try {
        profile = await ch(`/company/${candidate.number}`);
      } catch (error: any) {
        if ([401, 403, 429].includes(error?.status)) {
          paused = `Companies House said ${error.status}`;
          break;
        }
        continue;
      }

      const accountsType = String(profile?.accounts?.last_accounts?.type ?? "null").toLowerCase();
      if (!BIG_ENOUGH.includes(accountsType)) {
        tooSmall += 1;
        continue;
      }

      const band = BAND_50_PLUS.includes(accountsType) ? "50+" : "25-50";

      const { error } = await supabase.from("target_companies").insert({
        company_name: candidate.name,
        location: candidate.town || "Bristol",
        is_active: false, // switched on once we find their careers page
        staff_band: band,
        read_frequency: "rotating",
        discovered_from: "companies_house",
        notes: `Registered at ${candidate.postcode}; files ${accountsType} accounts`,
      });

      if (error) {
        if (!error.message.includes("duplicate")) console.error("Could not add company:", error.message);
        continue;
      }
      added += 1;
    }

    await supabase
      .from("job_locks")
      .update({
        locked_until: new Date().toISOString(),
        paused_reason: paused,
        updated_at: new Date().toISOString(),
      })
      .eq("job_name", JOB_NAME);

    return new Response(
      JSON.stringify({ postcodes, looked, candidates: candidates.length, added, tooSmall, agencies, paused }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("fetch-companies-house failed:", error);
    await supabase
      .from("job_locks")
      .update({ locked_until: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("job_name", JOB_NAME);
    return new Response(JSON.stringify({ error: error?.message ?? "failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
