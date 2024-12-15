import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EmployerNegotiationCard from "./sections/bonus/EmployerNegotiationCard";

interface BonusNegotiation {
  id: number;
  candidate_id: string;
  initial_commission: number;
  current_commission: number;
  status: string;
  job_id: number;
}

const BonusNegotiations = ({ employerId }: { employerId: string }) => {
  const [negotiations, setNegotiations] = useState<BonusNegotiation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('bonus-negotiations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'commission_negotiations'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          if (payload.eventType === 'UPDATE' && payload.new.status) {
            toast({
              title: "Bonus Negotiation Updated",
              description: `Candidate has ${payload.new.status} your offer.`,
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
  }, [employerId]);

  const fetchNegotiations = async () => {
    const { data, error } = await supabase
      .from('commission_negotiations')
      .select('*')
      .eq('employer_id', employerId)
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

  const updateOffer = async (negotiationId: number, newAmount: number) => {
    const { error } = await supabase
      .from('commission_negotiations')
      .update({
        current_commission: newAmount,
        updated_at: new Date().toISOString()
      })
      .eq('id', negotiationId);

    if (error) {
      console.error('Error updating negotiation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update bonus offer"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Bonus offer updated successfully"
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Active Bonus Negotiations</h3>
        <p className="text-sm text-muted-foreground">
          Here you can manage bonus negotiations with candidates. You can view the status 
          of each negotiation and adjust your offers based on candidate responses.
        </p>
      </div>

      {negotiations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active negotiations</p>
      ) : (
        <div className="space-y-4">
          {negotiations.map((negotiation) => (
            <EmployerNegotiationCard
              key={negotiation.id}
              negotiation={negotiation}
              onUpdateOffer={updateOffer}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BonusNegotiations;