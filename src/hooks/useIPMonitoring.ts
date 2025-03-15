
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useIPMonitoring = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  const checkSignupAttempt = async (email: string) => {
    try {
      // Get the user's IP address from Edge Function
      const { data: ipResponse, error: ipError } = await supabase.functions.invoke('get_client_ip');
      
      if (ipError) {
        console.error('Error getting IP:', ipError);
        return true; // Allow signup to proceed if we can't check IP
      }

      const ip_address = ipResponse?.ip_address;
      
      if (!ip_address) {
        console.error('No IP address returned');
        return true;
      }

      // Check signup attempts for this IP
      const { data, error } = await supabase.rpc('check_signup_attempts', {
        p_ip_address: ip_address,
        p_email: email
      });

      if (error) {
        console.error('Error checking signup attempts:', error);
        return true; // Allow signup to proceed if check fails
      }

      if (data && data.length > 0) {
        const [result] = data;
        setIsBlocked(!result.can_proceed);
        return result.can_proceed;
      }

      return true;
    } catch (error) {
      console.error('Error in IP monitoring:', error);
      return true; // Allow signup to proceed if something goes wrong
    }
  };

  return {
    isBlocked,
    checkSignupAttempt
  };
};
