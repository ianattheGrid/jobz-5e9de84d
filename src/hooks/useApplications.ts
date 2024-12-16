import { useState, useEffect } from "react";
import { useLoadApplications } from "./applications/useLoadApplications";
import { useApplicationActions } from "./applications/useApplicationActions";
import { ApplicationWithDetails } from "@/types/applications";

export const useApplications = () => {
  const { applications, unreadCount, loadApplications } = useLoadApplications();
  const { handleAccept, handleReject } = useApplicationActions(loadApplications);

  useEffect(() => {
    loadApplications();
    const channel = supabase
      .channel('application_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'applications',
        },
        () => {
          loadApplications();
          toast({
            title: "New Application",
            description: "You have a new candidate application!",
          });
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