
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
    
    // Enhanced skill matching algorithm with additional safeguards
    const matchedSkills = requiredSkills.filter((skill) => {
      const skillLower = skill.toLowerCase();
      
      // Skip very short skills (1-2 characters) completely
      if (skillLower.length <= 2) {
        return false;
      }
      
      // For short skills (3-4 chars), be extremely strict with word boundaries
      if (skillLower.length <= 4) {
        // For programming languages like "C#", "Go", "PHP", etc., look for exact matches with word boundaries
        const strictRegex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const result = strictRegex.test(cvContentLower);
        console.log(`Checking skill "${skill}" (short) with strict matching: ${result}`);
        return result;
      }
      
      // For longer skills, still use word boundaries but slightly more lenient
      const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      const result = regex.test(cvContentLower);
      console.log(`Checking skill "${skill}" with standard matching: ${result}`);
      return result;
    });

    console.log('Matched skills:', matchedSkills);

    // Calculate match percentage for CV skills
    const cvSkillsMatchScore = requiredSkills.length > 0 ? 
      matchedSkills.length / requiredSkills.length : 0;

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
