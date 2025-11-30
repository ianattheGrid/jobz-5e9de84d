import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, Sparkles } from 'lucide-react';

interface WebbyCandidateResponseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: number;
  employerId: string;
  roleTitle: string;
  area: string;
  payRange: string;
  onResponse: () => void;
}

export const WebbyCandidateResponseSheet = ({
  open,
  onOpenChange,
  jobId,
  employerId,
  roleTitle,
  area,
  payRange,
  onResponse
}: WebbyCandidateResponseSheetProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleResponse = async (action: 'view' | 'share' | 'decline') => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.functions.invoke('webby-respond-to-interest', {
        body: {
          job_id: jobId,
          employer_id: employerId,
          action
        }
      });

      if (error) throw error;

      toast({
        title: action === 'decline' ? 'Response sent' : 'Great choice!',
        description: 
          action === 'view' ? "I'll show you more details while keeping your identity hidden." :
          action === 'share' ? "I've shared your first name and opened a chat with the employer." :
          "I've let the employer know this role isn't for you."
      });

      onResponse();
      onOpenChange(false);
    } catch (error) {
      console.error('Error responding to interest:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send response. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto">
        <SheetHeader>
          <SheetTitle>An employer is interested in you</SheetTitle>
          <SheetDescription>
            A local employer has seen your profile and thinks you might be a good fit.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {/* Role Details */}
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">{roleTitle}</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{area}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{payRange}</span>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="text-muted-foreground">
              Your name and contact details are still hidden.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={() => handleResponse('view')}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              See more and stay semi-anonymous
            </Button>
            
            <Button
              onClick={() => handleResponse('share')}
              disabled={loading}
              className="w-full"
            >
              Share my first name and open a chat
            </Button>
            
            <Button
              onClick={() => handleResponse('decline')}
              disabled={loading}
              variant="ghost"
              className="w-full"
            >
              Not interested
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
