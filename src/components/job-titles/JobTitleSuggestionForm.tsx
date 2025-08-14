import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useJobTitles } from '@/hooks/useJobTitles';
import { supabase } from '@/integrations/supabase/client';

interface JobTitleSuggestionFormProps {
  workArea?: string;
  onSuggestionSubmitted?: () => void;
}

const workAreas = [
  'IT',
  'Finance',
  'Engineering',
  'Customer Service',
  'Hospitality',
  'Public Sector'
];

const JobTitleSuggestionForm = ({ workArea, onSuggestionSubmitted }: JobTitleSuggestionFormProps) => {
  const [open, setOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [selectedWorkArea, setSelectedWorkArea] = useState(workArea || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [similarTitles, setSimilarTitles] = useState<string[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const { suggestJobTitle } = useJobTitles();

  // Check for similar job titles when user types
  const checkForDuplicates = async (title: string, area: string) => {
    if (!title.trim() || !area || title.length < 3) {
      setSimilarTitles([]);
      setShowDuplicateWarning(false);
      return;
    }

    try {
      const { data } = await supabase.functions.invoke('check-job-title-duplicates', {
        body: { jobTitle: title, workArea: area }
      });

      if (data?.isDuplicate && data?.suggestions?.length > 0) {
        setSimilarTitles(data.suggestions.map((s: any) => s.existingTitle));
        setShowDuplicateWarning(true);
      } else {
        setSimilarTitles([]);
        setShowDuplicateWarning(false);
      }
    } catch (error) {
      console.error('Error checking duplicates:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobTitle.trim() || !selectedWorkArea) {
      return;
    }

    // Show warning if similar titles exist
    if (showDuplicateWarning) {
      const userConfirmed = window.confirm(
        `Similar job titles already exist: ${similarTitles.join(', ')}. Do you still want to suggest "${jobTitle}"?`
      );
      if (!userConfirmed) return;
    }

    setIsSubmitting(true);
    const success = await suggestJobTitle(jobTitle.trim(), selectedWorkArea);
    
    if (success) {
      setJobTitle('');
      setSelectedWorkArea(workArea || '');
      setSimilarTitles([]);
      setShowDuplicateWarning(false);
      setOpen(false);
      onSuggestionSubmitted?.();
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Suggest Job Title
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Suggest New Job Title</DialogTitle>
          <DialogDescription>
            Suggest a professional job title that's missing from our database. All suggestions are reviewed by our AI system and admin team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value);
                checkForDuplicates(e.target.value, selectedWorkArea);
              }}
              placeholder="e.g., Senior Full Stack Developer"
              required
            />
            {showDuplicateWarning && (
              <div className="text-sm text-amber-600 mt-1">
                ⚠️ Similar titles exist: {similarTitles.join(', ')}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workArea">Work Area</Label>
            <Select 
              value={selectedWorkArea} 
              onValueChange={setSelectedWorkArea}
              disabled={!!workArea}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select work area" />
              </SelectTrigger>
              <SelectContent>
                {workAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !jobTitle.trim() || !selectedWorkArea}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobTitleSuggestionForm;