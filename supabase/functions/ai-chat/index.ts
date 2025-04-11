
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.2'
import { OpenAI } from 'https://esm.sh/openai@4.26.0'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = 'https://lfwwhyjtbkfibxzefvkn.supabase.co'
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || ''

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize clients
    const supabase = createClient(supabaseUrl, supabaseKey)
    const openai = new OpenAI({ apiKey: openaiApiKey })

    // Get the JWT from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token or user not found' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse the request body
    const { messages, conversationId, userType } = await req.json()

    // Get user type-specific system instructions
    const systemInstruction = getSystemInstruction(userType)
    const fullMessages: Message[] = [
      { role: 'system', content: systemInstruction },
      ...messages
    ]

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Extract the assistant's response
    const assistantResponse = completion.choices[0].message.content

    // Save the response to the database
    if (conversationId) {
      await supabase.from('ai_chat_messages').insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantResponse
      })
    }

    // Return the assistant's response
    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Return different system instructions based on user type
function getSystemInstruction(userType: string): string {
  switch (userType) {
    case 'employer':
      return `You are an AI assistant for employers using a recruitment platform. 
      Your primary goals are to:
      1. Help employers understand how to post jobs effectively
      2. Guide them on using commission-based structures to attract top talent
      3. Explain how to review applications and conduct interviews
      4. Answer questions about employer verification and benefits
      5. Provide guidance on best hiring practices
      
      Keep responses concise, professional, and focused on recruitment. 
      Always prioritize UK employment regulations and standards.`
    
    case 'candidate':
      return `You are an AI assistant for job candidates using a recruitment platform.
      Your primary goals are to:
      1. Help candidates optimize their profiles for better job matching
      2. Guide them on understanding commission-based job opportunities
      3. Provide advice on interview preparation and salary negotiations
      4. Explain verification processes and profile enhancement
      5. Answer questions about the job application process
      
      Keep responses friendly, encouraging, and focused on helping candidates
      succeed in their job search. Emphasize UK employment contexts and standards.`
    
    case 'vr':
      return `You are an AI assistant for Virtual Recruiters (VRs) using a recruitment platform.
      Your primary goals are to:
      1. Help VRs understand how to recommend candidates effectively
      2. Guide them on maximizing commission opportunities
      3. Explain the verification process and compliance requirements
      4. Provide tips on candidate sourcing and professional networking
      5. Answer questions about the platform's VR-specific features
      
      Keep responses professional, action-oriented, and focused on successful matching
      of candidates to jobs. Emphasize UK recruitment standards and best practices.`
    
    default:
      return `You are a helpful AI assistant for a recruitment platform. 
      Provide clear, concise, and professional guidance related to recruitment,
      job searching, and career development.`
  }
}
