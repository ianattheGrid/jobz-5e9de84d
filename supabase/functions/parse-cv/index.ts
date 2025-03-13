
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define common skills to look for
const commonSkills = {
  it: ["JavaScript", "Python", "Java", "React", "Angular", "Node.js", "AWS", "Docker", "SQL", "Git"],
  sales: ["CRM", "Negotiation", "Sales Strategy", "Business Development", "Account Management"],
  marketing: ["Digital Marketing", "SEO", "Social Media", "Content Strategy", "Analytics"],
  finance: ["Financial Analysis", "Accounting", "Budgeting", "Excel", "Financial Reporting"],
  hr: ["Recruitment", "Employee Relations", "Training", "Performance Management", "HRIS"]
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get file URL and keywords from request
    const { fileUrl, keywords } = await req.json();

    if (!fileUrl) {
      throw new Error('No file URL provided');
    }

    // Download the file from Supabase storage
    const response = await fetch(fileUrl);
    const fileContent = await response.text().toLowerCase();
    
    // Basic keyword matching
    const matches = keywords.filter((keyword: string) => 
      fileContent.includes(keyword.toLowerCase())
    );

    // Extract skills from all categories
    const detectedSkills = Object.entries(commonSkills).reduce((acc, [category, skills]) => {
      const foundSkills = skills.filter(skill => 
        fileContent.includes(skill.toLowerCase())
      );
      if (foundSkills.length > 0) {
        acc[category] = foundSkills;
      }
      return acc;
    }, {} as Record<string, string[]>);

    const matchDetails = {
      totalKeywords: keywords.length,
      matchedKeywords: matches,
      matchCount: matches.length,
      matchPercentage: (matches.length / keywords.length) * 100,
      detectedSkills,
      topSkillsCategory: Object.entries(detectedSkills)
        .sort(([,a], [,b]) => b.length - a.length)[0]?.[0] || null
    };

    console.log('CV parsing completed:', matchDetails);

    return new Response(JSON.stringify(matchDetails), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error parsing CV:', error);
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
