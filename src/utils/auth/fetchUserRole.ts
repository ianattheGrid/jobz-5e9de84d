
import { supabase } from "@/integrations/supabase/client";

export const fetchUserRole = async (userId: string) => {
  const { data: userRole, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }

  return userRole;
};
