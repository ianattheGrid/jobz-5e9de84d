
import { supabase } from "@/integrations/supabase/client";

export const createUserRole = async (userId: string, role: string) => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role
      });

    if (error) {
      console.error('Error creating user role:', error);
      throw error;
    }
  } catch (err) {
    console.error('Exception creating user role:', err);
    throw err;
  }
};
