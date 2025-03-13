
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl, requiredSkills } = await req.json();

    if (!fileUrl || !requiredSkills) {
      throw new Error('Missing required parameters');
    }

    // Download the CV content
    const response = await fetch(fileUrl);
    const cvContent = await response.text().toLowerCase();
    
    // Match required skills against CV content
    const matchedSkills = requiredSkills.filter((skill: string) => 
      cvContent.includes(skill.toLowerCase())
    );

    // Calculate match percentage for CV skills
    const cvSkillsMatchScore = matchedSkills.length / requiredSkills.length;

    console.log('CV parsing completed:', {
      totalSkills: requiredSkills.length,
      matchedSkills,
      cvSkillsMatchScore
    });

    return new Response(JSON.stringify({
      matchedSkills,
      cvSkillsMatchScore
    }), {
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
