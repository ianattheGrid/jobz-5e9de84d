
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
    
    // Enhanced skill matching algorithm with comprehensive approach
    const matchedSkills = requiredSkills.filter((skill) => {
      const skillLower = skill.toLowerCase();
      
      // Skip very short skills completely
      if (skillLower.length <= 2) {
        return false;
      }
      
      // For short skills (3-4 chars), use strict word boundaries and validate context
      if (skillLower.length <= 4) {
        const strictRegex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const result = strictRegex.test(cvContentLower);
        console.log(`Checking short skill "${skill}" with strict matching: ${result}`);
        return result;
      }
      
      // For longer skills, check with proper word boundaries first
      const wordBoundaryRegex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (wordBoundaryRegex.test(cvContentLower)) {
        console.log(`Found skill "${skill}" with word boundary match`);
        return true;
      }

      // For multi-word skills, advanced matching logic
      if (skillLower.includes(' ')) {
        const words = skillLower.split(' ').filter(word => word.length > 3);
        if (words.length === 0) return false;
        
        // Check if all significant words appear in the CV within reasonable proximity
        const allWordsPresent = words.every(word => cvContentLower.includes(word));
        
        if (allWordsPresent) {
          // Check if the words are within a reasonable distance of each other
          // This helps detect phrases like "managing projects" when looking for "project management"
          const firstWordIndex = cvContentLower.indexOf(words[0]);
          const lastWordIndex = cvContentLower.indexOf(words[words.length - 1]);
          
          // If words are within 100 characters of each other, likely related
          const proximity = Math.abs(lastWordIndex - firstWordIndex) < 100;
          
          console.log(`Found multi-word skill "${skill}": all words present? ${allWordsPresent}, proximity? ${proximity}`);
          return proximity;
        }
      }
      
      // For technical skills that might appear with different endings (e.g., "design" vs "designing")
      if (skillLower.length > 5 && !skillLower.includes(' ')) {
        // Check for skill as a root word (e.g., "design" would match "designer" or "designing")
        const rootRegex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[a-z]*\\b`, 'i');
        const result = rootRegex.test(cvContentLower);
        if (result) {
          console.log(`Found skill "${skill}" with root word match`);
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
