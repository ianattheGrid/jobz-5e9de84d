
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
    
    // Enhanced skill matching algorithm with balanced approach
    const matchedSkills = requiredSkills.filter((skill) => {
      const skillLower = skill.toLowerCase();
      
      // Skip very short skills (1-2 characters) completely
      if (skillLower.length <= 2) {
        return false;
      }
      
      // For short skills (3-4 chars), use strict word boundaries
      if (skillLower.length <= 4) {
        const strictRegex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const result = strictRegex.test(cvContentLower);
        console.log(`Checking skill "${skill}" (short) with strict matching: ${result}`);
        return result;
      }
      
      // For longer skills, be slightly more flexible but still use proper word boundaries
      const wordBoundaryRegex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (wordBoundaryRegex.test(cvContentLower)) {
        console.log(`Found skill "${skill}" with word boundary match`);
        return true;
      }

      // For multi-word professional skills (like "project management"), 
      // allow more flexible matching as they might appear in various forms
      if (skillLower.includes(' ') && skillLower.length > 8) {
        // For longer multi-word skills, we can be a bit more lenient
        // This helps with skills like "project management" which might appear 
        // in different forms like "managing projects" or "project manager"
        const words = skillLower.split(' ');
        
        // Check if all words from the skill appear close to each other in the CV
        const wordProximity = words.every(word => {
          if (word.length <= 3) return true; // Skip very short words like "of", "in", etc.
          return cvContentLower.includes(word);
        });
        
        if (wordProximity) {
          console.log(`Found skill "${skill}" with word proximity match`);
          return true;
        }
      }
      
      return false;
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
