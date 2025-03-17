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
    const { fileUrl, requiredSkills, debug = false } = await req.json();

    if (!fileUrl || !requiredSkills) {
      throw new Error('Missing required parameters');
    }

    console.log('Processing CV:', fileUrl);
    console.log('Required skills to check:', requiredSkills);

    // Enhanced PDF handling with multiple strategies
    let cvContent = '';
    let retryCount = 0;
    const maxRetries = 3;
    let lastError = null;
    
    // Try different approaches to extract text from the PDF
    const strategies = [
      // Strategy 1: Simple fetch with text extraction
      async () => {
        console.log("Trying strategy 1: Simple fetch");
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch CV: ${response.status}`);
        }
        return await response.text();
      },
      
      // Strategy 2: Set explicit headers for PDF handling
      async () => {
        console.log("Trying strategy 2: With PDF headers");
        const response = await fetch(fileUrl, {
          headers: {
            'Accept': 'application/pdf, text/plain, */*',
            'Range': 'bytes=0-10000000',  // Get up to 10MB which should cover most CVs
          },
        });
        if (!response.ok) {
          throw new Error(`Failed with headers: ${response.status}`);
        }
        return await response.text();
      },
      
      // Strategy 3: Try to get raw binary data and convert
      async () => {
        console.log("Trying strategy 3: Binary approach");
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed binary fetch: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const textDecoder = new TextDecoder('utf-8', { fatal: false, ignoreBOM: true });
        const content = textDecoder.decode(arrayBuffer);
        
        // Clean up binary noise while keeping text
        return content.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
                      .replace(/\s+/g, ' ');
      }
    ];
    
    // Try each strategy until one succeeds
    let successfulStrategy = false;
    
    for (const [index, strategy] of strategies.entries()) {
      if (successfulStrategy) break;
      
      try {
        console.log(`Attempting extraction strategy ${index + 1}`);
        const content = await strategy();
        
        // Check if we got meaningful content
        if (content && content.length > 100 && content.match(/[a-zA-Z]{5,}/g)) {
          cvContent = content;
          console.log(`Strategy ${index + 1} succeeded with ${content.length} chars of content`);
          successfulStrategy = true;
          break;
        } else {
          console.log(`Strategy ${index + 1} returned insufficient content (${content?.length || 0} chars)`);
        }
      } catch (error) {
        console.error(`Strategy ${index + 1} failed:`, error);
        lastError = error;
      }
    }
    
    if (!successfulStrategy) {
      // Fall back to multiple retries of the basic approach
      while (retryCount < maxRetries && !cvContent) {
        try {
          console.log(`Retry attempt ${retryCount + 1} using basic fetch`);
          const response = await fetch(fileUrl);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch CV: ${response.status}`);
          }
          
          cvContent = await response.text();
          break;
        } catch (error) {
          console.error(`CV download attempt ${retryCount + 1} failed:`, error);
          lastError = error;
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    if (!cvContent || cvContent.length < 50) {
      return new Response(JSON.stringify({ 
        error: "Could not extract text from the CV. The file may be an image-based PDF or protected.",
        debug: debug ? { lastError: lastError?.message, contentLength: cvContent?.length || 0 } : undefined
      }), {
        status: 200,  // Return 200 but with error in payload so frontend can display it
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Make sure we have valid text content
    if (typeof cvContent !== 'string') {
      cvContent = String(cvContent);
    }
    
    const cvContentLower = cvContent.toLowerCase();
    console.log('CV content length:', cvContentLower.length);
    
    if (debug) {
      // Log a sample of the content for debugging
      console.log('CV content sample:', cvContentLower.substring(0, 500) + '...');
    }
    
    // Improved skill matching algorithm with comprehensive approach
    const matchedSkills = requiredSkills.filter((skill) => {
      const skillLower = skill.toLowerCase();
      
      // Skip very short skills 
      if (skillLower.length <= 2) {
        return false;
      }
      
      if (debug) {
        console.log(`Checking skill: "${skill}"`);
      }
      
      // For multi-word skills, try different approaches
      if (skillLower.includes(' ')) {
        // Exact phrase match with word boundaries
        const phraseRegex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (phraseRegex.test(cvContentLower)) {
          if (debug) console.log(`  Found exact phrase match for "${skill}"`);
          return true;
        }
        
        // Check for all words in proximity
        const words = skillLower.split(' ').filter(word => word.length > 2);
        if (words.length === 0) return false;
        
        const allWordsPresent = words.every(word => {
          const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*\\b`, 'i');
          return wordRegex.test(cvContentLower);
        });
        
        if (allWordsPresent) {
          // Check if the words are within a reasonable distance of each other
          // This helps detect variations like "designing web applications" vs "web design"
          const positions = words.map(word => {
            const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*\\b`, 'i');
            const match = wordRegex.exec(cvContentLower);
            return match ? match.index : -1;
          }).filter(pos => pos >= 0);
          
          if (positions.length >= words.length) {
            const minPos = Math.min(...positions);
            const maxPos = Math.max(...positions);
            
            // If words are within 100 characters of each other, likely related
            const proximity = maxPos - minPos < 150;
            
            if (debug) {
              console.log(`  Multi-word skill "${skill}": all words present with proximity=${proximity}`);
            }
            
            if (proximity) return true;
          }
        }
      } else {
        // For single word skills
        
        // First try exact word boundary match
        const exactRegex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (exactRegex.test(cvContentLower)) {
          if (debug) console.log(`  Found exact match for "${skill}"`);
          return true;
        }
        
        // Then try root word matching (e.g., "design" matches "designer")
        if (skillLower.length > 4) {
          const rootRegex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*\\b`, 'i');
          if (rootRegex.test(cvContentLower)) {
            if (debug) console.log(`  Found root word match for "${skill}"`);
            return true;
          }
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
      cvSkillsMatchScore,
      debug: debug ? {
        contentLength: cvContentLower.length,
        contentSample: cvContentLower.substring(0, 200) + '...'
      } : undefined
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
