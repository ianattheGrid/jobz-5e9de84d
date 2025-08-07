import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';

interface SkillSuggestionFormProps {
  workArea: string;
  specialization?: string;
  onSuggestionSubmitted?: () => void;
}

const WORK_AREAS = [
  'IT',
  'Customer Service',
  'Finance', 
  'Public Sector',
  'Engineering',
  'Hospitality'
];

const IT_SPECIALIZATIONS = [
  'Software Development',
  'Web Development', 
  'Mobile Development',
  'DevOps',
  'Data Science',
  'Cybersecurity',
  'Network Administration',
  'Database Management',
  'Cloud Computing',
  'AI/Machine Learning'
];

const SkillSuggestionForm = ({ workArea, specialization, onSuggestionSubmitted }: SkillSuggestionFormProps) => {
  const [open, setOpen] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [selectedWorkArea, setSelectedWorkArea] = useState(workArea);
  const [selectedSpecialization, setSelectedSpecialization] = useState(specialization || '');
  const [submitting, setSubmitting] = useState(false);
  
  const { suggestSkill } = useSkills();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skillName.trim()) return;
    
    setSubmitting(true);
    try {
      await suggestSkill(
        skillName.trim(),
        selectedWorkArea,
        selectedSpecialization || undefined
      );
      
      setSkillName('');
      setOpen(false);
      onSuggestionSubmitted?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Suggest New Skill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suggest a New Skill</DialogTitle>
          <DialogDescription>
            Can't find the skill you're looking for? Suggest it and we'll review it for addition to our database.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-name">Skill Name</Label>
            <Input
              id="skill-name"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g., React, Python, Customer Support"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="work-area">Work Area</Label>
            <Select value={selectedWorkArea} onValueChange={setSelectedWorkArea}>
              <SelectTrigger>
                <SelectValue placeholder="Select work area" />
              </SelectTrigger>
              <SelectContent>
                {WORK_AREAS.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedWorkArea === 'IT' && (
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization (Optional)</Label>
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">General</SelectItem>
                  {IT_SPECIALIZATIONS.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !skillName.trim()}>
              {submitting ? 'Submitting...' : 'Submit Suggestion'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SkillSuggestionForm;