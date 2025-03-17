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

    // Attempt PDF text extraction with different methods
    const extractTextMethods = [
      // Method 1: Using text extraction with PDF.js approach
      async () => {
        console.log("Trying fetch with PDF.js approach");
        try {
          // Fetch the PDF file as an ArrayBuffer
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.status}`);
          }
          
          // Get the file content as text directly (might work for some PDFs)
          const text = await response.text();
          
          // If the text starts with "%PDF" it's likely in binary format and we need to extract visible text
          if (text.startsWith("%PDF") || text.includes("PDF-")) {
            // For binary PDFs, extract text using the content we have
            // Remove binary noise but keep text content
            const cleanedText = text.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\xFF]/g, ' ')
                                    .replace(/\s+/g, ' ');
            return cleanedText;
          }
          
          return text;
        } catch (error) {
          console.error("Method 1 failed:", error);
          return null;
        }
      },
      
      // Method 2: Try with different headers and Accept types
      async () => {
        console.log("Trying fetch with different Accept headers");
        try {
          const response = await fetch(fileUrl, {
            headers: {
              'Accept': 'text/plain, application/pdf, */*',
              'Cache-Control': 'no-cache'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch with Accept headers: ${response.status}`);
          }
          
          // Try to get text content
          const text = await response.text();
          return text;
        } catch (error) {
          console.error("Method 2 failed:", error);
          return null;
        }
      },
      
      // Method 3: Try to get raw bytes and perform manual text extraction
      async () => {
        console.log("Trying binary approach with manual text extraction");
        try {
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error(`Failed with binary fetch: ${response.status}`);
          }
          
          const arrayBuffer = await response.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          
          // Extract text content manually from PDF structure
          // This is a simplified approach - we're looking for text between PDF stream markers
          let extractedText = "";
          const bytesStr = new TextDecoder().decode(bytes);
          
          // Look for text between BT (Begin Text) and ET (End Text) markers in the PDF
          const textRegex = /BT\s*(.*?)\s*ET/gs;
          const matches = bytesStr.match(textRegex);
          
          if (matches && matches.length > 0) {
            extractedText = matches.join(' ');
          }
          
          // If no matches, try to get any readable text 
          if (!extractedText) {
            extractedText = bytesStr.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ');
          }
          
          return extractedText;
        } catch (error) {
          console.error("Method 3 failed:", error);
          return null;
        }
      }
    ];
    
    // Try each extraction method until one succeeds
    let cvContent = "";
    let extractionMethod = 0;
    
    for (const method of extractTextMethods) {
      extractionMethod++;
      console.log(`Attempting extraction method ${extractionMethod}`);
      
      const result = await method();
      if (result && result.length > 100) {
        cvContent = result;
        console.log(`Method ${extractionMethod} succeeded with ${result.length} chars`);
        break;
      } else {
        console.log(`Method ${extractionMethod} failed or returned insufficient content`);
      }
    }
    
    // If all methods fail, return an error
    if (!cvContent || cvContent.length < 100) {
      return new Response(JSON.stringify({ 
        error: "Could not extract text from the PDF. The file may be an image-based PDF or protected.",
        debug: debug ? { contentLength: cvContent?.length || 0 } : undefined
      }), {
        status: 200,  // Return 200 but with error in payload 
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
      console.log('CV content sample (first 300 chars):', cvContentLower.substring(0, 300));
    }
    
    // Enhanced skill matching with multiple approaches
    const matchedSkills = [];
    
    for (const skill of requiredSkills) {
      const skillLower = skill.toLowerCase();
      let found = false;
      
      // Skip very short skills 
      if (skillLower.length <= 2) {
        continue;
      }
      
      // 1. Direct exact match
      if (cvContentLower.includes(skillLower)) {
        matchedSkills.push(skill);
        found = true;
        if (debug) console.log(`Found direct match for "${skill}"`);
        continue;
      }
      
      // 2. Word boundary match
      if (!found) {
        const wordBoundaryRegex = new RegExp(`\\b${skillLower}\\b`, 'i');
        if (wordBoundaryRegex.test(cvContentLower)) {
          matchedSkills.push(skill);
          found = true;
          if (debug) console.log(`Found word boundary match for "${skill}"`);
          continue;
        }
      }
      
      // 3. For multi-word skills, try individual word matching
      if (!found && skillLower.includes(' ')) {
        const words = skillLower.split(' ').filter(w => w.length > 2);
        if (words.length > 0) {
          const allWordsPresent = words.every(word => 
            cvContentLower.includes(word)
          );
          
          if (allWordsPresent) {
            matchedSkills.push(skill);
            found = true;
            if (debug) console.log(`Found all words match for "${skill}"`);
            continue;
          }
        }
      }
      
      // 4. For technical skills, check for variations (e.g., React/ReactJS)
      if (!found) {
        if ((skillLower === 'react' && 
            (cvContentLower.includes('reactjs') || cvContentLower.includes('react.js'))) ||
            (skillLower === 'angular' && 
            (cvContentLower.includes('angularjs') || cvContentLower.includes('angular.js'))) ||
            (skillLower === 'vue' && 
            (cvContentLower.includes('vuejs') || cvContentLower.includes('vue.js'))) ||
            (skillLower === 'node' && 
            (cvContentLower.includes('nodejs') || cvContentLower.includes('node.js')))
           ) {
          matchedSkills.push(skill);
          found = true;
          if (debug) console.log(`Found variation match for "${skill}"`);
          continue;
        }
      }
    }

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
        contentSample: cvContentLower.substring(0, 200) + '...',
        extractionMethod
      } : undefined
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error parsing CV:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
