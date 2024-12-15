import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    // Subscribe to real-time updates
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
          fetchNegotiations();
        }
      )
      .subscribe();

    // Initial fetch
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
        description: "Failed to load commission negotiations"
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
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Active Bonus Negotiations</h3>
        <p className="text-sm text-muted-foreground">
          When employers are interested in your profile, they may initiate a bonus negotiation. 
          Here you can view and respond to bonus offers in real-time. Each offer shows the initial 
          and current bonus percentage being offered. You can choose to accept or decline these offers, 
          and employers may adjust their offers based on your response. All negotiations are handled 
          securely and transparently through our platform.
        </p>
      </div>
      {negotiations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active negotiations</p>
      ) : (
        <div className="space-y-4">
          {negotiations.map((negotiation) => (
            <Card key={negotiation.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  Commission Offer: {negotiation.current_commission}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Initial offer: {negotiation.initial_commission}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: {negotiation.status}
                  </p>
                  {negotiation.status === 'pending' && (
                    <div className="flex space-x-2 mt-4">
                      <Button
                        variant="default"
                        onClick={() => respondToOffer(negotiation.id, true)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => respondToOffer(negotiation.id, false)}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommissionNegotiation;