import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import NegotiationCard from "./NegotiationCard";

interface CommissionNegotiation {
  id: number;
  job_id: number;
  initial_commission: number;
  current_commission: number;
  status: string;
}

const CommissionNegotiation = () => {
  const [negotiations, setNegotiations] = useState<CommissionNegotiation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('commission-negotiations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'commission_negotiations'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Bonus Negotiation",
              description: "A new bonus negotiation has been initiated.",
            });
          }
          fetchNegotiations();
        }
      )
      .subscribe();

    fetchNegotiations();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNegotiations = async () => {
    const { data, error } = await supabase
      .from('commission_negotiations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching negotiations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load bonus negotiations"
      });
      return;
    }

    setNegotiations(data);
  };

  const respondToOffer = async (negotiationId: number, accepted: boolean) => {
    const { error } = await supabase
      .from('commission_negotiations')
      .update({
        status: accepted ? 'accepted' : 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', negotiationId);

    if (error) {
      console.error('Error updating negotiation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to respond to offer"
      });
      return;
    }

    toast({
      title: "Success",
      description: `Offer ${accepted ? 'accepted' : 'rejected'} successfully`
    });
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Active Bonus Negotiations</h3>
        <p className="text-sm text-muted-foreground">
          When employers are interested in your profile, they may initiate a bonus negotiation. 
          You can view and respond to bonus offers in real-time.
        </p>
      </div>
      {negotiations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active negotiations</p>
      ) : (
        <div className="space-y-4">
          {negotiations.map((negotiation) => (
            <NegotiationCard
              key={negotiation.id}
              negotiation={negotiation}
              onRespond={respondToOffer}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommissionNegotiation;