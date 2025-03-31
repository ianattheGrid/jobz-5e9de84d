
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

import { DateSelector } from "./bonus-payment/DateSelector";
import { PaymentSummary } from "./bonus-payment/PaymentSummary";
import { PaymentTermsCheckbox } from "./bonus-payment/PaymentTermsCheckbox";
import { CompletedPayment } from "./bonus-payment/CompletedPayment";
import { VRCommissionAlert } from "./bonus-payment/VRCommissionAlert";

interface BonusPaymentConfirmationProps {
  jobId: number;
  candidateId: string;
  candidateEmail: string;
  candidateCommission: number;
  vrCommission?: number;
  recommendationId?: number;
  vrId?: string;
  vrRecommended?: boolean;
  onComplete?: () => void;
}

export const BonusPaymentConfirmation = ({
  jobId,
  candidateId,
  candidateEmail,
  candidateCommission,
  vrCommission,
  recommendationId,
  vrId,
  vrRecommended = false,
  onComplete
}: BonusPaymentConfirmationProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const calculatePaymentDueDate = (date: Date): Date => {
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 30);
    return dueDate;
  };

  // Shows VR commission notice when a VR is getting commission that wasn't initially configured
  const showVrCommissionNotice = vrRecommended && vrCommission && vrCommission > 0;
  
  const handleSubmit = async () => {
    if (!startDate) {
      toast({
        variant: "destructive",
        title: "Start date required",
        description: "Please select when the candidate will start the job"
      });
      return;
    }

    if (!termsAgreed) {
      toast({
        variant: "destructive",
        title: "Please agree to the terms",
        description: "You must agree to the payment terms to continue"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("You must be signed in");
      }
      
      const employerId = sessionData.session.user.id;
      const paymentDueDate = calculatePaymentDueDate(startDate);
      
      const { error } = await supabase
        .from('bonus_payments')
        .insert({
          job_id: jobId,
          candidate_id: candidateId,
          employer_id: employerId,
          recommendation_id: recommendationId || null,
          vr_id: vrId || null,
          candidate_commission: candidateCommission,
          vr_commission: vrCommission || null,
          start_date: startDate.toISOString(),
          payment_due_date: paymentDueDate.toISOString(),
          payment_status: 'pending',
          confirmed_at: new Date().toISOString()
        });

      if (error) throw error;
      
      await supabase
        .from('applications')
        .update({ status: 'hired' })
        .eq('job_id', jobId)
        .eq('applicant_id', candidateId);
      
      if (recommendationId) {
        await supabase
          .from('candidate_recommendations')
          .update({ status: 'hired' })
          .eq('id', recommendationId);
      } else if (vrId && !recommendationId) {
        try {
          await supabase
            .from('candidate_recommendations')
            .insert({
              vr_id: vrId,
              candidate_email: candidateEmail,
              job_id: jobId,
              status: 'hired',
              recommendation_type: 'general'
            });
        } catch (recError) {
          console.error('Error creating recommendation record:', recError);
        }
      }
      
      toast({
        title: "Payment confirmed",
        description: `Bonus payment for ${candidateEmail} has been confirmed. Payment is due by ${format(paymentDueDate, 'PPP')}.`
      });
      
      setIsCompleted(true);
      if (onComplete) onComplete();
      
    } catch (error: any) {
      console.error("Error confirming bonus payment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to confirm bonus payment. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return <CompletedPayment />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Confirm Candidate Start Date</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Confirming the candidate start date will trigger the bonus payment process.
                  Payment is due within 30 days of the start date.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Please confirm when {candidateEmail} will start this position
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showVrCommissionNotice && (
          <VRCommissionAlert vrCommission={vrCommission || 0} />
        )}

        <DateSelector
          date={startDate}
          onDateChange={setStartDate}
          label="Candidate Start Date"
          placeholder="Select start date"
        />

        <PaymentSummary
          candidateCommission={candidateCommission}
          vrCommission={vrCommission}
        />

        <PaymentTermsCheckbox
          checked={termsAgreed}
          onCheckedChange={setTermsAgreed}
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !startDate || !termsAgreed}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processing...
            </>
          ) : (
            "Confirm & Save"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
