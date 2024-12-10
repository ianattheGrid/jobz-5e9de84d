import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  userType: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, userType } = await req.json() as EmailRequest;
    
    const subject = `Welcome to JobConnect - Your ${userType} Account`;
    const html = `
      <h1>Welcome to JobConnect!</h1>
      <p>Thank you for creating a ${userType} account with us.</p>
      <p>You can now start using our platform to:</p>
      ${userType === 'employer' ? `
        <ul>
          <li>Post job vacancies</li>
          <li>Review applications</li>
          <li>Schedule interviews</li>
        </ul>
      ` : ''}
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
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
        subject,
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