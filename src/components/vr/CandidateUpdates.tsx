
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CandidateUpdate {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  related_entity_id: string | null;
}

export const CandidateUpdates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [updates, setUpdates] = useState<CandidateUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUpdates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("push_notifications")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "vr_candidate_update")
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) throw error;
        setUpdates(data || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load candidate updates"
        });
        console.error("Error fetching candidate updates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();

    // Subscribe to new notifications
    const channel = supabase
      .channel("candidate-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "push_notifications",
          filter: `user_id=eq.${user.id} AND type=eq.vr_candidate_update`,
        },
        (payload) => {
          setUpdates((current) => [payload.new as CandidateUpdate, ...current]);
          toast({
            title: payload.new.title,
            description: payload.new.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("push_notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      setUpdates((current) =>
        current.map((update) =>
          update.id === id ? { ...update, is_read: true } : update
        )
      );
    } catch (error: any) {
      console.error("Error marking update as read:", error);
    }
  };

  if (loading) {
    return <div className="space-y-3">
      {[1, 2, 3].map((n) => (
        <div key={n} className="bg-muted/30 rounded-lg p-3">
          <div className="h-3 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-2 bg-muted rounded w-3/4"></div>
        </div>
      ))}
    </div>;
  }

  if (updates.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        No candidate updates yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {updates.map((update) => (
        <div 
          key={update.id} 
          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
            update.is_read 
              ? "bg-background hover:bg-muted/50" 
              : "bg-primary/5 border-primary/20 hover:bg-primary/10"
          }`}
          onClick={() => !update.is_read && markAsRead(update.id)}
        >
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-sm">{update.title}</h4>
            {!update.is_read && (
              <Badge variant="default" className="bg-primary text-primary-foreground text-xs">New</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{update.message}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(update.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};
