
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

    console.log('Processing CV:', fileUrl);
    console.log('Required skills to check:', requiredSkills);

    // Download the CV content
    const response = await fetch(fileUrl);
    
    // Check if we got a valid response
    if (!response.ok) {
      throw new Error(`Failed to fetch CV: ${response.status} ${response.statusText}`);
    }
    
    // Get CV content as text
    const cvContent = await response.text();
    
    // Make sure we have valid text content
    if (!cvContent || typeof cvContent !== 'string') {
      console.log('No valid text content found in CV');
      return new Response(JSON.stringify({
        matchedSkills: [],
        cvSkillsMatchScore: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const cvContentLower = cvContent.toLowerCase();
    console.log('CV content length:', cvContentLower.length);
    
    // Match required skills against CV content with more accurate matching
    // to avoid false positives for short skill names
    const matchedSkills = requiredSkills.filter((skill) => {
      const skillLower = skill.toLowerCase();
      
      // For very short skills (1-2 characters), require word boundaries or specific context
      if (skillLower.length <= 2) {
        // Skip very short skills to avoid false positives
        return false;
      } else if (skillLower.length <= 3) {
        // For short skills (3 chars), check for word boundaries
        const regex = new RegExp(`\\b${skillLower}\\b`, 'i');
        return regex.test(cvContentLower);
      } else {
        // For longer skills, we can be more lenient but still use word boundaries
        const regex = new RegExp(`\\b${skillLower}\\b`, 'i');
        return regex.test(cvContentLower);
      }
    });

    console.log('Matched skills:', matchedSkills);

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
