
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.2'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = 'https://lfwwhyjtbkfibxzefvkn.supabase.co'
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''

// Get Abacus AI API key from environment
const abacusApiKey = Deno.env.get('ABACUS_AI_API_KEY')

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

Deno.serve(async (req) => {
  console.log('AI Chat function called with method:', req.method)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check for required environment variables
    if (!abacusApiKey) {
      console.error('ABACUS_AI_API_KEY is not set')
      return new Response(
        JSON.stringify({ error: 'Abacus AI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

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
    console.log('Parsing request body...')
    const body = await req.json()
    const { messages, conversationId, userType } = body
    console.log('Request body parsed:', { userType, conversationId, messageCount: messages?.length })

    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format:', messages)
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user type-specific system instructions
    console.log('Getting system instruction for user type:', userType)
    const systemInstruction = getSystemInstruction(userType)
    const fullMessages: Message[] = [
      { role: 'system', content: systemInstruction },
      ...messages
    ]
    console.log('Full messages prepared, count:', fullMessages.length)

    // Call Abacus AI API
    console.log('Calling Abacus AI API...')
    console.log('API Key present:', !!abacusApiKey)
    console.log('API Key length:', abacusApiKey?.length)
    
    const requestBody = {
      model: 'gpt-4o-mini',
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 1000,
    }
    console.log('Request body:', JSON.stringify(requestBody, null, 2))
    
    try {
      const response = await fetch('https://api.abacus.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${abacusApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Abacus AI API error details:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        })
        
        // Return a helpful error message instead of throwing
        return new Response(
          JSON.stringify({ 
            error: `AI service temporarily unavailable (${response.status}). Please try again later.`,
            details: `Status: ${response.status}, Error: ${errorText.substring(0, 200)}`
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const data = await response.json()
      console.log('Abacus AI API response:', JSON.stringify(data, null, 2))

      // Extract the assistant's response (OpenAI-compatible format)
      const assistantResponse = data.choices?.[0]?.message?.content
      console.log('Assistant response extracted:', assistantResponse?.substring(0, 100) + '...')

      if (!assistantResponse) {
        console.error('No response content found in API response:', data)
        return new Response(
          JSON.stringify({ 
            error: "AI service returned empty response. Please try again.",
            responseStructure: JSON.stringify(data)
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

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
      
    } catch (apiError) {
      console.error('API call failed:', apiError)
      return new Response(
        JSON.stringify({ 
          error: "AI service connection failed. Please try again.",
          details: apiError.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('General error:', error.message, error.stack)
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred. Please try again.",
        details: error.message
      }),
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
