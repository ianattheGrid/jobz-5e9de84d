import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  console.log('View CV function called:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Environment check:', { 
      hasUrl: !!supabaseUrl, 
      hasServiceKey: !!supabaseServiceKey 
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user's JWT token using the anon key client
    const token = authHeader.replace('Bearer ', '');
    const anonClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '');
    const { data: { user }, error: authError } = await anonClient.auth.getUser(token);
    
    console.log('User verification:', { hasUser: !!user, authError });
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token', details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the file path from the request
    const requestBody = await req.json();
    const { filePath } = requestBody;
    
    console.log('File path received:', filePath);
    
    if (!filePath) {
      return new Response(
        JSON.stringify({ error: 'No file path provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract user ID from file path and verify it matches the authenticated user
    const userIdFromPath = filePath.split('/')[0];
    console.log('User ID comparison:', { fromPath: userIdFromPath, fromAuth: user.id });
    
    if (userIdFromPath !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create signed URL using service role (bypasses RLS)
    console.log('Creating signed URL for:', filePath);
    const { data, error } = await supabase.storage
      .from('cvs')
      .createSignedUrl(filePath, 3600);

    if (error) {
      console.error('Error creating signed URL:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create signed URL', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Signed URL created successfully');
    return new Response(
      JSON.stringify({ signedUrl: data.signedUrl }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in view-cv function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});