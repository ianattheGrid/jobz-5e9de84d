
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CreditCard, Clock, AlertCircle, CheckCircle } from "lucide-react";

interface BonusPayment {
  id: string;
  candidate_email: string;
  job_title: string;
  start_date: string;
  payment_due_date: string;
  candidate_commission: number;
  vr_commission: number | null;
  payment_status: string;
}

export const BonusPaymentsSection = ({ employerId }: { employerId: string }) => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<BonusPayment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBonusPayments = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('bonus_payments')
          .select(`
            id,
            start_date,
            payment_due_date,
            candidate_commission,
            vr_commission,
            payment_status,
            jobs!inner(title),
            candidate_profiles!inner(email)
          `)
          .eq('employer_id', employerId)
          .order('payment_due_date', { ascending: true });
          
        if (error) throw error;
        
        // Transform data to match our component needs
        const formattedPayments = data.map(item => ({
          id: item.id,
          candidate_email: item.candidate_profiles.email,
          job_title: item.jobs.title,
          start_date: item.start_date,
          payment_due_date: item.payment_due_date,
          candidate_commission: item.candidate_commission,
          vr_commission: item.vr_commission,
          payment_status: item.payment_status
        }));
        
        setPayments(formattedPayments);
      } catch (error: any) {
        console.error('Error fetching bonus payments:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load bonus payments"
        });
      } finally {
        setLoading(false);
      }
    };

    if (employerId) {
      fetchBonusPayments();
    }
  }, [employerId, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Paid</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Overdue</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Bonus Payments</h3>
          <p className="text-sm text-muted-foreground">Loading bonus payment information...</p>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Bonus Payments</h3>
          <p className="text-sm text-muted-foreground">No bonus payments due at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Bonus Payments Due</h3>
        <p className="text-sm text-muted-foreground">
          Manage your bonus payments for hired candidates. Payments are due within 30 days of the candidate's start date.
        </p>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{payment.job_title}</CardTitle>
                {getStatusBadge(payment.payment_status)}
              </div>
              <CardDescription>Candidate: {payment.candidate_email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{format(new Date(payment.start_date), 'PPP')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Due</p>
                    <p className="font-medium">{format(new Date(payment.payment_due_date), 'PPP')}</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t mt-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Total Due: £{(payment.candidate_commission + (payment.vr_commission || 0)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.payment_status)}
                      <span className="text-sm">{payment.payment_status === 'pending' ? 'Payment pending' : 
                        payment.payment_status === 'paid' ? 'Payment complete' : 'Payment overdue'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
