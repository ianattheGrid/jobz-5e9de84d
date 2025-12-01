import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

interface WebbyJobDeclineSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: number;
  jobTitle: string;
  onDeclineComplete: () => void;
}

export const WebbyJobDeclineSheet = ({
  open,
  onOpenChange,
  jobId,
  jobTitle,
  onDeclineComplete
}: WebbyJobDeclineSheetProps) => {
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDecline = async () => {
    if (!reason) {
      toast({
        variant: 'destructive',
        title: 'Please select a reason',
        description: 'Let me know why this role isn\'t right so I can improve your matches.'
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('webby-decline-job', {
        body: {
          job_id: jobId,
          reason
        }
      });

      if (error) throw error;

      if (reason === 'never_show_again') {
        toast({
          title: 'Got it!',
          description: "Okay, I'll stop showing you roles like this."
        });
      } else {
        toast({
          title: 'Thanks for the feedback',
          description: "I'll use this to improve your matches."
        });
      }

      onDeclineComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error declining job:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save your response. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto">
        <SheetHeader>
          <SheetTitle>Not interested in this role?</SheetTitle>
          <SheetDescription>
            {jobTitle}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>Help me understand what's off so I can improve your matches</p>
          </div>

          <RadioGroup value={reason} onValueChange={setReason}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wrong_area" id="wrong_area" />
              <Label htmlFor="wrong_area" className="cursor-pointer">
                Wrong area
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pay_too_low" id="pay_too_low" />
              <Label htmlFor="pay_too_low" className="cursor-pointer">
                Pay too low
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wrong_type" id="wrong_type" />
              <Label htmlFor="wrong_type" className="cursor-pointer">
                Wrong type of work
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never_show_again" id="never_show_again" />
              <Label htmlFor="never_show_again" className="cursor-pointer font-semibold">
                Never show this kind of role again
              </Label>
            </div>
          </RadioGroup>

          {reason === 'never_show_again' && (
            <div className="bg-muted p-3 rounded-lg text-sm">
              <p className="text-muted-foreground">
                I'll add this type of role to your avoid list and won't show similar jobs in the future.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDecline}
              className="flex-1"
              disabled={loading || !reason}
            >
              {loading ? 'Saving...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
