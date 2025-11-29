import { Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface WebbyToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  loading?: boolean;
}

export const WebbyToggle = ({ enabled, onToggle, loading }: WebbyToggleProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <Label htmlFor="webby-toggle" className="text-base font-semibold cursor-pointer">
            Use Webby AI Co-pilot
          </Label>
          <p className="text-sm text-muted-foreground">
            Get AI-powered help finding matches
          </p>
        </div>
      </div>
      <Switch
        id="webby-toggle"
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={loading}
      />
    </div>
  );
};
