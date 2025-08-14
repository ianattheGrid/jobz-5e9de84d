import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useJobTitles } from '@/hooks/useJobTitles';

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
  const { suggestJobTitle } = useJobTitles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobTitle.trim() || !selectedWorkArea) {
      return;
    }

    setIsSubmitting(true);
    const success = await suggestJobTitle(jobTitle.trim(), selectedWorkArea);
    
    if (success) {
      setJobTitle('');
      setSelectedWorkArea(workArea || '');
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
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Full Stack Developer"
              required
            />
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