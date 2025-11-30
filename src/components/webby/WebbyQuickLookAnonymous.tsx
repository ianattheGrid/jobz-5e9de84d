import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Briefcase, CheckCircle2, ThumbsDown } from 'lucide-react';
import { getPseudonym, getRoughLocation, formatPayRange, formatAvailability } from '@/lib/anonymize';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnonymousQuickLookData {
  id: string;
  job_title: string;
  location?: string[] | null;
  years_experience?: number;
  skills?: string[] | null;
  match_score?: number;
  match_reason?: string;
  webby_profile?: {
    rough_location?: string | null;
    min_hourly_rate?: number | null;
    min_annual_salary?: number | null;
    availability_slots?: any;
    hours_per_week_min?: number | null;
    hours_per_week_max?: number | null;
    skills_tags?: string[] | null;
    soft_skills_self_assessed?: string[] | null;
    environment_preferences?: string[] | null;
    life_outside_work?: string | null;
    hobbies_activities?: any;
  };
}

interface WebbyQuickLookAnonymousProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: AnonymousQuickLookData | null;
  userType: 'candidate' | 'employer';
  onInviteToChat: (id: string) => void;
  onNotRight?: (id: string) => void;
}

export const WebbyQuickLookAnonymous = ({
  open,
  onOpenChange,
  data,
  userType,
  onInviteToChat,
  onNotRight,
}: WebbyQuickLookAnonymousProps) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!data) return;

    const checkPresence = async () => {
      const { data: presenceData } = await supabase
        .from('webby_presence')
        .select('is_online')
        .eq('user_id', data.id)
        .single();
      
      setIsOnline(presenceData?.is_online || false);
    };

    checkPresence();
  }, [data]);

  if (!data) return null;

  const pseudonym = getPseudonym(data.id, userType === 'employer' ? 'candidate' : 'employer');
  const area = data.webby_profile?.rough_location || getRoughLocation(data.location);
  const payRange = formatPayRange(
    data.webby_profile?.min_hourly_rate,
    data.webby_profile?.min_annual_salary
  );
  const availability = formatAvailability(
    data.webby_profile?.availability_slots,
    data.webby_profile?.hours_per_week_min,
    data.webby_profile?.hours_per_week_max
  );
  const skills = data.webby_profile?.skills_tags || data.skills || [];
  const softSkills = data.webby_profile?.soft_skills_self_assessed || [];
  const environmentPrefs = data.webby_profile?.environment_preferences || [];

  const handleInvite = () => {
    onInviteToChat(data.id);
    onOpenChange(false);
  };

  const handleNotRight = () => {
    if (onNotRight) {
      onNotRight(data.id);
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl">{pseudonym}</SheetTitle>
              <SheetDescription className="text-base">{data.job_title}</SheetDescription>
            </div>
            {data.match_score && (
              <Badge variant="secondary" className="gap-1">
                {data.match_score}%
              </Badge>
            )}
          </div>
          {isOnline && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Active now</span>
            </div>
          )}
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Quick Info */}
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-xs text-muted-foreground mb-0.5">Area</div>
                <div>{area}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-xs text-muted-foreground mb-0.5">Availability</div>
                <div>{availability}</div>
              </div>
            </div>
            {data.years_experience !== undefined && (
              <div className="flex items-start gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-xs text-muted-foreground mb-0.5">Experience</div>
                  <div>{data.years_experience} years in {data.job_title}</div>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground shrink-0">💷</span>
              <div>
                <div className="font-medium text-xs text-muted-foreground mb-0.5">Looking for</div>
                <div>{payRange}</div>
              </div>
            </div>
          </div>

          {/* Match Reason */}
          {data.match_reason && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1 text-sm">Why this is a great match</h3>
                  <p className="text-sm text-muted-foreground">{data.match_reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Skills & Experience */}
          {skills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-sm">Skills / Experience</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {skills.map((skill, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Soft Skills */}
          {softSkills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-sm">Soft Skills & Qualities</h3>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Work Preferences */}
          {environmentPrefs.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-sm">Work Preferences</h3>
              <p className="text-sm text-muted-foreground">
                {environmentPrefs.join(', ')}
              </p>
            </div>
          )}

          {/* Life Outside Work */}
          {data.webby_profile?.life_outside_work && (
            <div>
              <h3 className="font-semibold mb-2 text-sm">About</h3>
              <p className="text-sm text-muted-foreground">
                {data.webby_profile.life_outside_work}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4 border-t">
            <Button
              onClick={handleInvite}
              className="w-full gap-2"
              size="lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              Invite to chat
            </Button>
            {onNotRight && (
              <Button
                onClick={handleNotRight}
                variant="outline"
                className="w-full gap-2"
                size="lg"
              >
                <ThumbsDown className="w-4 h-4" />
                Not right
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
