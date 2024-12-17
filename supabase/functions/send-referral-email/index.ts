import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  vrName: string;
  referralCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, vrName, referralCode } = await req.json() as EmailRequest;
    
    const html = `
      <h1>You've Been Recommended!</h1>
      <p>${vrName} has recommended you for job opportunities on JobConnect!</p>
      <p>Click the link below to create your account and start exploring jobs:</p>
      <a href="${req.headers.get("origin")}/candidate/signup?ref=${referralCode}">
        Sign Up Now
      </a>
      <p>By using this link, you'll be connected to your recommender who can help guide you through the job search process.</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "JobConnect <onboarding@resend.dev>",
        to,
        subject: "You've Been Recommended for Job Opportunities!",
        html,
      }),
    });

    const data = await res.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);