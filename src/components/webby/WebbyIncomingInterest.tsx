import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Heart, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface InterestData {
  type: 'quick_look' | 'interested';
  from_user_type: string;
  from_name?: string;
  from_title?: string;
  from_company?: string;
  from_avatar?: string;
}

interface WebbyIncomingInterestProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: InterestData | null;
  onInterested: () => void;
  onDismiss: () => void;
}

export const WebbyIncomingInterest = ({
  open,
  onOpenChange,
  data,
  onInterested,
  onDismiss,
}: WebbyIncomingInterestProps) => {
  if (!data) return null;

  const isQuickLook = data.type === 'quick_look';
  const Icon = isQuickLook ? Eye : Heart;
  
  const title = isQuickLook 
    ? `Someone is viewing your profile` 
    : `Someone is interested in you!`;
  
  const description = isQuickLook
    ? `A ${data.from_user_type} is checking out your profile right now`
    : `A ${data.from_user_type} at ${data.from_company || 'a company'} wants to connect`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg">{title}</DialogTitle>
              <DialogDescription className="text-sm">{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!isQuickLook && (
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={data.from_avatar} />
              <AvatarFallback>
                {data.from_name?.[0] || data.from_user_type[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{data.from_name || 'Hiring Manager'}</p>
              <p className="text-sm text-muted-foreground">
                {data.from_title || 'Position available'}
              </p>
              {data.from_company && (
                <p className="text-xs text-muted-foreground">{data.from_company}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {!isQuickLook && (
            <Button onClick={onInterested} className="flex-1 gap-2">
              <Heart className="w-4 h-4" />
              Yes, I'm interested!
            </Button>
          )}
          <Button 
            onClick={onDismiss} 
            variant="outline" 
            className={isQuickLook ? 'flex-1' : ''}
          >
            <X className="w-4 h-4 mr-2" />
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
