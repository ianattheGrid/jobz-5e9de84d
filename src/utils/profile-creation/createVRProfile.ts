
import { supabase } from "@/integrations/supabase/client";

export const createVRProfile = async (userId: string, fullName: string, email: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-vr-profile', {
      body: {
        userId,
        fullName,
        email
      }
    });
    
    if (error) {
      console.error('Error creating VR profile:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Exception creating VR profile:', err);
    throw err;
  }
};
