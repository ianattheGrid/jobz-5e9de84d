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

    // Enhanced PDF handling with retries and additional headers
    let cvContent = '';
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        // Download the CV content with additional headers to improve PDF handling
        const response = await fetch(fileUrl, {
          headers: {
            'Accept': 'text/plain, application/pdf, text/html, application/octet-stream',
            'Range': 'bytes=0-5000000', // Get first 5MB which should contain text content
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch CV: ${response.status} ${response.statusText}`);
        }
        
        // For PDFs, we'll try to extract as much text as possible
        const contentType = response.headers.get('content-type');
        console.log(`Content type: ${contentType}`);
        
        if (contentType?.includes('pdf')) {
          console.log('Processing PDF file');
          // For PDFs, we try to get as much textual content as possible
          // The browser/viewer will handle actual PDF parsing
          cvContent = await response.text();
          
          // PDFs often have poor text extraction, so we'll try more approaches
          // Check if we got any reasonable content
          if (cvContent.length < 500 || !cvContent.match(/[a-zA-Z]{5}/g)) {
            console.log('PDF text extraction yielded limited content, trying binary approach');
            // Try a different approach - get as binary, convert what we can
            const binResponse = await fetch(fileUrl);
            const arrayBuffer = await binResponse.arrayBuffer();
            
            // Convert binary data to a string, focusing on ASCII text parts
            const textDecoder = new TextDecoder('utf-8', { fatal: false, ignoreBOM: true });
            let binContent = textDecoder.decode(arrayBuffer);
            
            // Clean up binary noise while keeping potential text content
            binContent = binContent.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
                                .replace(/\s+/g, ' ');
                                
            // If we got more meaningful content, use it
            if (binContent.length > cvContent.length) {
              cvContent = binContent;
              console.log('Using binary-extracted content');
            }
          }
        } else {
          // For other formats, assume it's readable text
          cvContent = await response.text();
        }
        
        break; // If we got here, we succeeded
      } catch (error) {
        console.error(`CV download attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        
        if (retryCount >= maxRetries) {
          throw new Error(`Failed to download CV after ${maxRetries} attempts`);
        }
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!cvContent) {
      throw new Error('Could not extract text from the uploaded CV');
    }
    
    // Make sure we have valid text content
    if (typeof cvContent !== 'string') {
      console.log('Converting CV content to string');
      cvContent = String(cvContent);
    }
    
    const cvContentLower = cvContent.toLowerCase();
    console.log('CV content length:', cvContentLower.length);
    console.log('CV content sample:', cvContentLower.substring(0, 200) + '...');
    
    // Improved skill matching algorithm with comprehensive approach
    const matchedSkills = requiredSkills.filter((skill) => {
      const skillLower = skill.toLowerCase();
      
      // Skip very short skills 
      if (skillLower.length <= 2) {
        return false;
      }
      
      // Log the skill we're checking
      console.log(`Checking skill: "${skill}"`);
      
      // For short skills (3-4 chars), use strict word boundaries and validate context
      if (skillLower.length <= 4) {
        const strictRegex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const result = strictRegex.test(cvContentLower);
        console.log(`  Short skill "${skill}" with strict matching: ${result}`);
        return result;
      }
      
      // For longer skills, check with proper word boundaries first
      const wordBoundaryRegex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (wordBoundaryRegex.test(cvContentLower)) {
        console.log(`  Found skill "${skill}" with word boundary match`);
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
          const positions = words.map(word => cvContentLower.indexOf(word)).filter(pos => pos >= 0);
          if (positions.length < 2) return allWordsPresent;
          
          const minPos = Math.min(...positions);
          const maxPos = Math.max(...positions);
          
          // If words are within 200 characters of each other, likely related
          const proximity = maxPos - minPos < 200;
          
          console.log(`  Multi-word skill "${skill}": all words present? ${allWordsPresent}, proximity? ${proximity}`);
          return proximity;
        }
      }
      
      // For technical skills that might appear with different endings (e.g., "design" vs "designing")
      if (skillLower.length > 5 && !skillLower.includes(' ')) {
        // Check for skill as a root word (e.g., "design" would match "designer" or "designing")
        const rootRegex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[a-z]*\\b`, 'i');
        const result = rootRegex.test(cvContentLower);
        if (result) {
          console.log(`  Found skill "${skill}" with root word match`);
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
