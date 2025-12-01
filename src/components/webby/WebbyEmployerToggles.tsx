import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, GraduationCap, Heart } from 'lucide-react';

interface WebbyEmployerTogglesProps {
  openToCareerSwitchers: boolean;
  willingToTrainOnTheJob: boolean;
  valuesSoftSkillsOverExperience: boolean;
  onToggle: (field: string, value: boolean) => void;
}

export const WebbyEmployerToggles = ({
  openToCareerSwitchers,
  willingToTrainOnTheJob,
  valuesSoftSkillsOverExperience,
  onToggle
}: WebbyEmployerTogglesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Hire Beyond the Status Quo
        </CardTitle>
        <CardDescription>
          Tell me if you're open to non-traditional candidates. I can show you people with the right attitude and transferable skills, even if their CV doesn't match perfectly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3 flex-1">
            <GraduationCap className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="space-y-1">
              <Label htmlFor="career-switchers" className="text-base">
                Open to career-switchers
              </Label>
              <p className="text-sm text-muted-foreground">
                Consider candidates changing careers if they have the right attitude and learning ability
              </p>
            </div>
          </div>
          <Switch
            id="career-switchers"
            checked={openToCareerSwitchers}
            onCheckedChange={(checked) => onToggle('open_to_career_switchers', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3 flex-1">
            <GraduationCap className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="space-y-1">
              <Label htmlFor="willing-to-train" className="text-base">
                Willing to train on the job
              </Label>
              <p className="text-sm text-muted-foreground">
                Happy to teach someone with potential rather than requiring everything upfront
              </p>
            </div>
          </div>
          <Switch
            id="willing-to-train"
            checked={willingToTrainOnTheJob}
            onCheckedChange={(checked) => onToggle('willing_to_train_on_the_job', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Heart className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="space-y-1">
              <Label htmlFor="soft-skills" className="text-base">
                Value soft skills over specific experience
              </Label>
              <p className="text-sm text-muted-foreground">
                Prioritise attitude, personality fit, and people skills over perfect technical match
              </p>
            </div>
          </div>
          <Switch
            id="soft-skills"
            checked={valuesSoftSkillsOverExperience}
            onCheckedChange={(checked) => onToggle('values_soft_skills_over_experience', checked)}
          />
        </div>

        {(openToCareerSwitchers || willingToTrainOnTheJob) && (
          <div className="bg-primary/10 p-3 rounded-lg text-sm">
            <p className="text-primary">
              Great! I'll show you candidates whose "Next Chapter" goals align with this role, even if their past job titles are in different sectors. These are often the best hires.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
