import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Calendar, Star, Heart, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface QuickLookData {
  id: string;
  name: string;
  title: string;
  location?: string;
  experience?: number;
  skills?: string[];
  match_score?: number;
  match_reason?: string;
  profile_picture_url?: string;
  company?: string;
  salary_range?: string;
}

interface WebbyQuickLookProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: QuickLookData | null;
  userType: 'candidate' | 'employer';
  onInterested: (id: string) => void;
  onBroadcastLook?: (id: string) => void;
}

export const WebbyQuickLook = ({
  open,
  onOpenChange,
  data,
  userType,
  onInterested,
  onBroadcastLook,
}: WebbyQuickLookProps) => {
  if (!data) return null;

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && onBroadcastLook) {
      onBroadcastLook(data.id);
    }
    onOpenChange(isOpen);
  };

  const handleInterested = () => {
    onInterested(data.id);
    onOpenChange(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-16 h-16">
                <AvatarImage src={data.profile_picture_url} />
                <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-xl">{data.name}</SheetTitle>
                <SheetDescription className="text-base">{data.title}</SheetDescription>
              </div>
            </div>
            {data.match_score && (
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3 fill-current" />
                {data.match_score}%
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Quick Info */}
          <div className="space-y-3">
            {data.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{data.location}</span>
              </div>
            )}
            {data.experience !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>{data.experience} years experience</span>
              </div>
            )}
            {data.company && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>{data.company}</span>
              </div>
            )}
            {data.salary_range && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{data.salary_range}</span>
              </div>
            )}
          </div>

          {/* Match Reason */}
          {data.match_reason && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm">Why this is a great match</h3>
              <p className="text-sm text-muted-foreground">{data.match_reason}</p>
            </div>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-sm">Key Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.slice(0, 6).map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
                {data.skills.length > 6 && (
                  <Badge variant="outline">+{data.skills.length - 6} more</Badge>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleInterested}
              className="flex-1 gap-2"
              size="lg"
            >
              <Heart className="w-4 h-4" />
              I'm Interested
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              size="lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
