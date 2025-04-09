
import { supabase } from "@/integrations/supabase/client";

export const createUserRole = async (userId: string, role: string) => {
  try {
    // Check if the role already exists
    const { data } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    // If role already exists, don't insert a new one
    if (data && data.length > 0) {
      console.log('User role already exists for user:', userId);
      return;
    }
    
    // Insert only if it doesn't exist already
    const { error } = await supabase
      .from('user_roles')
      .upsert(
        {
          user_id: userId,
          role: role
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Error creating user role:', error);
      throw error;
    }
  } catch (err) {
    console.error('Exception creating user role:', err);
    throw err;
  }
};
