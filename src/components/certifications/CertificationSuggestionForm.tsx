import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useCertifications } from '@/hooks/useCertifications';

interface CertificationSuggestionFormProps {
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
  'Hospitality',
  'HR',
  'Legal',
  'Manufacturing',
  'Energy & Utilities',
  'Pharma',
  'R&D',
  'Sales',
  'Quality Assurance',
  'Marketing'
];

const CertificationSuggestionForm = ({ workArea, specialization, onSuggestionSubmitted }: CertificationSuggestionFormProps) => {
  const [open, setOpen] = useState(false);
  const [certificationName, setCertificationName] = useState('');
  const [selectedWorkArea, setSelectedWorkArea] = useState(workArea);
  const [selectedSpecialization, setSelectedSpecialization] = useState(specialization || '');
  const [submitting, setSubmitting] = useState(false);
  
  const { suggestCertification } = useCertifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificationName.trim()) return;
    
    setSubmitting(true);
    try {
      await suggestCertification(
        certificationName.trim(),
        selectedWorkArea,
        selectedSpecialization || undefined
      );
      
      setCertificationName('');
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
          Suggest New Certification
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border z-50">
        <DialogHeader>
          <DialogTitle>Suggest a New Certification</DialogTitle>
          <DialogDescription>
            Can't find the certification you're looking for? Suggest it and we'll review it for addition to our database.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certification-name">Certification Name</Label>
            <Input
              id="certification-name"
              value={certificationName}
              onChange={(e) => setCertificationName(e.target.value)}
              placeholder="e.g., AWS Certified Solutions Architect, ACCA, PMP"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="work-area">Work Area</Label>
            <Select value={selectedWorkArea} onValueChange={setSelectedWorkArea}>
              <SelectTrigger>
                <SelectValue placeholder="Select work area" />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                {WORK_AREAS.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization (Optional)</Label>
            <Input
              id="specialization"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              placeholder="e.g., Cloud Computing, Digital Marketing"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !certificationName.trim()}>
              {submitting ? 'Submitting...' : 'Submit Suggestion'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CertificationSuggestionForm;