import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting test data population...');

    // 1. Populate webby_candidate_profiles
    const candidateProfiles = [
      {
        candidate_id: '83165187-8b97-4cfa-9518-278fa2aa32e2', // Ian Gibbons (REAL ID)
        rough_location: 'BS5 - East Bristol',
        min_annual_salary: 50000,
        skills_tags: ['Azure', 'Cloud Architecture', 'DevOps', 'CI/CD'],
        industry_tags: ['Technology', 'SaaS'],
        environment_preferences: ['Collaborative', 'Fast-paced'],
        soft_skills_self_assessed: ['Problem solver', 'Team player', 'Strategic thinker'],
        hobbies_activities: {
          interests: ['Cycling', 'Photography', 'Tech meetups'],
          description: 'Active cyclist, amateur photographer'
        },
        hours_per_week_min: 40,
        hours_per_week_max: 40,
        location_radius_miles: 10,
        webby_summary: 'Experienced cloud architect with strong Azure and DevOps background. Passionate about building scalable systems.',
        availability_slots: {
          Monday: ['9:00-17:00'],
          Tuesday: ['9:00-17:00'],
          Wednesday: ['9:00-17:00'],
          Thursday: ['9:00-17:00'],
          Friday: ['9:00-17:00']
        }
      },
      {
        candidate_id: '5b546213-8ff3-416b-9a2a-56562468ff3f', // John Smith (REAL ID)
        rough_location: 'BS1 - City Centre',
        min_annual_salary: 55000,
        skills_tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        industry_tags: ['Technology', 'Startups'],
        environment_preferences: ['Flexible', 'Remote-friendly'],
        soft_skills_self_assessed: ['Good communicator', 'Mentor', 'Leadership'],
        hobbies_activities: {
          interests: ['Football coaching', 'Gaming', 'Community teaching'],
          description: 'Coaches youth football team, passionate about mentoring'
        },
        hours_per_week_min: 30,
        hours_per_week_max: 40,
        location_radius_miles: 15,
        webby_summary: 'Full stack developer with strong React and Node.js skills. Experienced in mentoring and team leadership.',
        availability_slots: {
          Monday: ['flexible'],
          Tuesday: ['flexible'],
          Wednesday: ['flexible'],
          Thursday: ['flexible'],
          Friday: ['flexible']
        }
      },
      {
        candidate_id: 'f0204453-ee5e-4f08-b367-a68c868d1585', // Tom (REAL ID)
        rough_location: 'BS2 - Southville',
        min_hourly_rate: 14,
        skills_tags: ['JavaScript', 'CSS', 'HTML', 'Customer Support'],
        industry_tags: ['Technology', 'Creative'],
        environment_preferences: ['Creative', 'Customer-focused'],
        soft_skills_self_assessed: ['Patient', 'Detail-oriented', 'Creative'],
        hobbies_activities: {
          interests: ['Music teaching', 'Volunteering', 'Community arts'],
          description: 'Part-time music teacher, volunteers at local community center'
        },
        hours_per_week_min: 15,
        hours_per_week_max: 25,
        location_radius_miles: 8,
        webby_summary: 'Frontend developer with customer support experience. Enjoys creative work and helping others.',
        availability_slots: {
          Monday: ['18:00-22:00'],
          Tuesday: ['18:00-22:00'],
          Wednesday: ['18:00-22:00'],
          Saturday: ['10:00-18:00'],
          Sunday: ['10:00-18:00']
        }
      },
      {
        candidate_id: 'eeacd12a-f03f-4ac3-8e39-e798e0b63fdf', // Direct Applicant (REAL ID)
        rough_location: 'BS3 - Bedminster',
        min_annual_salary: 35000,
        skills_tags: ['React', 'SQL', 'Python', 'Testing'],
        industry_tags: ['Technology', 'Health & Fitness'],
        environment_preferences: ['Supportive', 'Growth-oriented'],
        soft_skills_self_assessed: ['Disciplined', 'Goal-oriented', 'Supportive'],
        hobbies_activities: {
          interests: ['Marathon running', 'Mentoring', 'Fitness coaching'],
          description: 'Marathon runner, mentors junior developers'
        },
        hours_per_week_min: 20,
        hours_per_week_max: 30,
        location_radius_miles: 12,
        webby_summary: 'Part-time frontend developer with strong React skills. Marathon runner with excellent discipline and mentoring experience.',
        availability_slots: {
          Monday: ['9:00-14:00'],
          Wednesday: ['9:00-14:00'],
          Friday: ['9:00-14:00']
        }
      }
    ];

    for (const profile of candidateProfiles) {
      const { error } = await supabase
        .from('webby_candidate_profiles')
        .upsert(profile, { onConflict: 'candidate_id' });
      
      if (error) {
        console.error(`Error upserting candidate ${profile.candidate_id}:`, error);
      } else {
        console.log(`✓ Candidate profile created: ${profile.rough_location}`);
      }
    }

    // 2. Populate webby_job_specs
    const jobSpec = {
      job_id: 1,
      employer_id: '4bd0cb47-d489-4223-b9b5-fb188c31e028', // Ian's employer profile
      role_title: 'Full Stack Developer',
      required_skills: ['React', 'TypeScript', 'Node.js'],
      nice_to_have_skills: ['PostgreSQL', 'Docker', 'AWS'],
      soft_qualities_needed: ['Team player', 'Problem solver', 'Good communicator'],
      hidden_skills_welcome: ['Teaching', 'Coaching', 'Leadership', 'Mentoring'],
      pay_range_min: 45000,
      pay_range_max: 65000,
      employment_type: 'full-time',
      seniority_level: 'mid',
      company_culture: 'Fast-paced startup, collaborative environment, focus on continuous learning',
      webby_summary: 'Looking for a passionate full stack developer to join our growing team. We value team players who love to learn and mentor others.'
    };

    const { error: jobSpecError } = await supabase
      .from('webby_job_specs')
      .upsert(jobSpec, { onConflict: 'job_id' });

    if (jobSpecError) {
      console.error('Error creating job spec:', jobSpecError);
    } else {
      console.log('✓ Job spec created for Full Stack Developer');
    }

    // 3. Set up webby_presence (2 online, 2 offline)
    const presenceData = [
      {
        user_id: '83165187-8b97-4cfa-9518-278fa2aa32e2', // Ian Gibbons
        user_type: 'candidate',
        is_online: true,
        last_seen: new Date().toISOString()
      },
      {
        user_id: '5b546213-8ff3-416b-9a2a-56562468ff3f', // John Smith
        user_type: 'candidate',
        is_online: true,
        last_seen: new Date().toISOString()
      },
      {
        user_id: 'f0204453-ee5e-4f08-b367-a68c868d1585', // Tom
        user_type: 'candidate',
        is_online: false,
        last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
      {
        user_id: 'eeacd12a-f03f-4ac3-8e39-e798e0b63fdf', // Direct Applicant
        user_type: 'candidate',
        is_online: false,
        last_seen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      }
    ];

    for (const presence of presenceData) {
      const { error } = await supabase
        .from('webby_presence')
        .upsert(presence, { onConflict: 'user_id' });

      if (error) {
        console.error(`Error setting presence for ${presence.user_id}:`, error);
      } else {
        console.log(`✓ Presence set: ${presence.is_online ? 'Online' : 'Offline'}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test data populated successfully',
        summary: {
          candidateProfiles: candidateProfiles.length,
          jobSpecs: 1,
          presenceRecords: presenceData.length,
          onlineCandidates: 2,
          offlineCandidates: 2
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in webby-seed-test-data:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
