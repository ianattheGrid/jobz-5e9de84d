import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

interface DuplicateCheckRequest {
  jobTitle: string;
  workArea: string;
  specialization?: string;
}

// Job title similarity groups for duplicate detection
const jobTitleSimilarityGroups = [
  ['Software Engineer', 'Software Developer', 'Developer', 'Programmer'],
  ['Full Stack Developer', 'Full-Stack Engineer', 'Fullstack Developer'],
  ['Frontend Developer', 'Front-End Developer', 'UI Developer'],
  ['Backend Developer', 'Back-End Developer', 'Server-Side Developer'],
  ['Data Scientist', 'Data Science Engineer', 'ML Engineer'],
  ['DevOps Engineer', 'DevOps Specialist', 'Site Reliability Engineer'],
  ['IT Manager', 'Technology Manager', 'Tech Manager'],
  // Add more groups as needed
];

function findSimilarJobTitles(jobTitle: string): string[] {
  const lowerTitle = jobTitle.toLowerCase();
  
  const exactGroup = jobTitleSimilarityGroups.find(group => 
    group.some(title => title.toLowerCase() === lowerTitle)
  );
  
  if (exactGroup) return exactGroup;
  
  const partialGroup = jobTitleSimilarityGroups.find(group =>
    group.some(title => 
      title.toLowerCase().includes(lowerTitle) || 
      lowerTitle.includes(title.toLowerCase())
    )
  );
  
  return partialGroup || [jobTitle];
}

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Calculate word overlap
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const intersection = words1.filter(word => 
    words2.some(w => w.includes(word) || word.includes(w))
  );
  
  if (intersection.length === 0) return 0;
  
  return intersection.length / Math.max(words1.length, words2.length);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobTitle, workArea, specialization }: DuplicateCheckRequest = await req.json();

    console.log('Checking for similar job titles:', { jobTitle, workArea, specialization });

    // Get similar job titles
    const similarTitles = findSimilarJobTitles(jobTitle);
    
    // Check against existing job titles in master_job_titles
    const { data: existingTitles, error } = await supabase
      .from('master_job_titles')
      .select('job_title, work_area, specialization')
      .eq('work_area', workArea);

    if (error) {
      console.error('Error fetching existing job titles:', error);
      throw error;
    }

    const potentialDuplicates = [];
    const threshold = 0.7; // Similarity threshold for potential duplicates

    for (const existing of existingTitles || []) {
      // Skip if specializations don't match (when both are specified)
      if (specialization && existing.specialization && 
          specialization !== existing.specialization) {
        continue;
      }

      const similarity = calculateSimilarity(jobTitle, existing.job_title);
      
      // Also check against similar titles
      const maxSimilarity = Math.max(
        similarity,
        ...similarTitles.map(similar => 
          calculateSimilarity(similar, existing.job_title)
        )
      );

      if (maxSimilarity >= threshold) {
        potentialDuplicates.push({
          existingTitle: existing.job_title,
          similarity: maxSimilarity,
          specialization: existing.specialization
        });
      }
    }

    // Sort by similarity score (highest first)
    potentialDuplicates.sort((a, b) => b.similarity - a.similarity);

    return new Response(
      JSON.stringify({
        isDuplicate: potentialDuplicates.length > 0,
        suggestions: potentialDuplicates.slice(0, 3), // Return top 3 matches
        similarTitles: similarTitles.filter(title => title !== jobTitle)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error checking job title duplicates:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to check for duplicates',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});