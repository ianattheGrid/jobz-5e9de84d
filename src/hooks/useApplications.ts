import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLoadApplications } from "./applications/useLoadApplications";
import { useApplicationActions } from "./applications/useApplicationActions";

export const useApplications = () => {
  const { applications, unreadCount, loadApplications } = useLoadApplications();
  const { handleAccept, handleReject } = useApplicationActions(loadApplications);

  useEffect(() => {
    loadApplications();

    const channel = supabase
      .channel('applications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        () => {
          loadApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    applications,
    unreadCount,
    handleAccept,
    handleReject
  };
};