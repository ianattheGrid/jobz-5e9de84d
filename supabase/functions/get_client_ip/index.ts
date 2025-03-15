
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const ip_address = req.headers.get('x-real-ip') || 
                    req.headers.get('x-forwarded-for')?.split(',')[0] || 
                    '0.0.0.0';

  return new Response(
    JSON.stringify({ ip_address }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
