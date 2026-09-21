// Free, no-account salary check: what a Bristol role is really worth, and what
// an agency would charge an employer to fill it.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const MAX_INPUT = 8000;
const RATE_LIMIT = 10; // per IP per hour
const TOOL = "job-worth";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => null);
    const jobText = typeof body?.jobText === "string" ? body.jobText.trim() : "";
    const followUpEmail = typeof body?.followUpEmail === "string" ? body.followUpEmail.trim() : "";

    if (jobText.length < 10) {
      return json({ error: "Paste a job title or an advert so we know what to look at." }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    const hourAgo = new Date(Date.now() - 60 * 60_000).toISOString();
    const { count } = await supabase
      .from("public_tool_usage")
      .select("id", { count: "exact", head: true })
      .eq("tool", TOOL)
      .eq("ip_address", ip)
      .gte("used_at", hourAgo);

    if ((count ?? 0) >= RATE_LIMIT) {
      return json({ error: "You've had a few of these in the last hour. Try again shortly." }, 429);
    }

    await supabase.from("public_tool_usage").insert({ tool: TOOL, ip_address: ip });

    if (!LOVABLE_API_KEY) return json({ error: "The salary check isn't configured yet." }, 500);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a UK pay specialist covering Bristol and the South West. Give honest, publicly reported salary " +
              "ranges in pounds sterling for the role described. Use British English. Never invent precision: give a " +
              "sensible range, say plainly that these are publicly reported ranges rather than a guarantee, and if the " +
              "role is too vague to price, say so in the summary. Base the agency fee on 20% of the mid-point.",
          },
          { role: "user", content: jobText.slice(0, MAX_INPUT) },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_job_worth",
              description: "Pay guidance for a role in Bristol.",
              parameters: {
                type: "object",
                properties: {
                  roleTitle: { type: "string", description: "The role as you understood it" },
                  lowSalary: { type: "number", description: "Lower end of the typical Bristol range, GBP per year" },
                  midSalary: { type: "number", description: "Typical Bristol salary, GBP per year" },
                  highSalary: { type: "number", description: "Upper end of the typical Bristol range, GBP per year" },
                  summary: { type: "string", description: "Two or three sentences on what drives pay for this role" },
                  raisesPay: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 specific things that push pay towards the top of the range",
                  },
                  confidence: {
                    type: "string",
                    description: "high, medium or low — how well the description supports a range",
                  },
                },
                required: ["roleTitle", "lowSalary", "midSalary", "highSalary", "summary", "raisesPay", "confidence"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_job_worth" } },
      }),
    });

    if (response.status === 429) {
      return json({ error: "Lots of people checking right now — try again in a moment." }, 429);
    }
    if (response.status === 402) {
      return json({ error: "The salary check is temporarily unavailable. Please try again later." }, 402);
    }
    if (!response.ok) {
      const detail = await response.text();
      console.error(`job-worth gateway error [${response.status}]: ${detail}`);
      return json({ error: "We couldn't work that one out. Please try again." }, 502);
    }

    const data = await response.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    let result: Record<string, unknown> | null = null;
    if (call?.function?.arguments) {
      try {
        result = JSON.parse(call.function.arguments);
      } catch {
        result = null;
      }
    }
    if (!result) return json({ error: "We couldn't read that job description. Try again." }, 502);

    const mid = Number(result.midSalary) || 0;
    (result as any).agencyFee = mid ? Math.round(mid * 0.2) : null;
    (result as any).jobzMonthly = 9;

    // Only if they explicitly asked us to follow up. A duplicate simply means
    // they've already asked once — the unique index keeps it to one email.
    if (followUpEmail && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(followUpEmail)) {
      const { error: followUpError } = await supabase.from("growth_followups").insert({
        email: followUpEmail,
        kind: "salary_tool",
        due_at: new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString(),
      });
      if (followUpError && !followUpError.message.includes("duplicate")) {
        console.error("Could not record follow-up:", followUpError.message);
      }
    }

    return json({ result });
  } catch (error: any) {
    console.error("job-worth failed:", error);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
