import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarIcon, CheckCircle2, Info } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BonusPaymentConfirmationProps {
  jobId: number;
  candidateId: string;
  candidateEmail: string;
  candidateCommission: number;
  vrCommission?: number;
  recommendationId?: number;
  onComplete?: () => void;
}

export const BonusPaymentConfirmation = ({
  jobId,
  candidateId,
  candidateEmail,
  candidateCommission,
  vrCommission,
  recommendationId,
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
      
      // Get current user to confirm employer ID
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("You must be signed in");
      }
      
      const employerId = sessionData.session.user.id;
      const paymentDueDate = calculatePaymentDueDate(startDate);
      
      // Create bonus payment record
      const { error } = await supabase
        .from('bonus_payments')
        .insert({
          job_id: jobId,
          candidate_id: candidateId,
          employer_id: employerId,
          recommendation_id: recommendationId || null,
          candidate_commission: candidateCommission,
          vr_commission: vrCommission || null,
          start_date: startDate.toISOString(),
          payment_due_date: paymentDueDate.toISOString(),
          payment_status: 'pending',
          confirmed_at: new Date().toISOString()
        });

      if (error) throw error;
      
      // Update application status to 'hired'
      await supabase
        .from('applications')
        .update({ status: 'hired' })
        .eq('job_id', jobId)
        .eq('applicant_id', candidateId);
      
      // If this came from a VR recommendation, update its status
      if (recommendationId) {
        await supabase
          .from('candidate_recommendations')
          .update({ status: 'hired' })
          .eq('id', recommendationId);
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
    return (
      <Card className="border-green-100">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <h3 className="text-lg font-medium">Bonus payment confirmed</h3>
            <p className="text-sm text-muted-foreground">
              We'll process the bonuses once payment is received.
            </p>
          </div>
        </CardContent>
      </Card>
    );
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Candidate Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Select start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Payment Summary</div>
          <div className="rounded-md border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Candidate Bonus:</span>
              <span className="font-medium">£{candidateCommission.toLocaleString()}</span>
            </div>
            {vrCommission && vrCommission > 0 && (
              <div className="flex justify-between text-sm">
                <span>Recruiter Bonus:</span>
                <span className="font-medium">£{vrCommission.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
              <span>Total Due:</span>
              <span>£{(candidateCommission + (vrCommission || 0)).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox 
            id="terms" 
            checked={termsAgreed}
            onCheckedChange={(checked) => setTermsAgreed(checked as boolean)} 
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Payment Terms
            </label>
            <p className="text-sm text-muted-foreground">
              I agree to pay the total amount within 30 days of the candidate's start date. 
              I understand that bonuses will be distributed after payment is received.
            </p>
          </div>
        </div>
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
