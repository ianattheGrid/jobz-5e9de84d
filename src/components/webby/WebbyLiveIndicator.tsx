import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WebbyLiveIndicatorProps {
  onlineCount: number;
  userType: 'candidate' | 'employer';
}

export const WebbyLiveIndicator = ({ onlineCount, userType }: WebbyLiveIndicatorProps) => {
  const label = userType === 'candidate' ? 'employers' : 'candidates';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-medium">Live</span>
      </div>
      {onlineCount > 0 && (
        <Badge variant="secondary" className="gap-1">
          <Users className="w-3 h-3" />
          <span>{onlineCount} {label} online</span>
        </Badge>
      )}
    </div>
  );
};
