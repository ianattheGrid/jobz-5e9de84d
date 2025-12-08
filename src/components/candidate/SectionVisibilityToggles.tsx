
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const defaultSections = {
  about: true,
  personality: true,
  experience: true,
  skills: true,
  qualifications: true,
  location: true,
  gallery: true,
  proof_of_potential: true,
  second_chapter: true,
  linkedin: true,
};

interface SectionVisibilityTogglesProps {
  userId: string;
  initial?: Partial<typeof defaultSections> | null;
  onChange?: (next: typeof defaultSections) => void;
}

export function SectionVisibilityToggles({ userId, initial, onChange }: SectionVisibilityTogglesProps) {
  const [sections, setSections] = useState<typeof defaultSections>({ ...defaultSections, ...(initial || {}) });
  const { toast } = useToast();

  useEffect(() => {
    setSections(prev => ({ ...prev, ...(initial || {}) }));
  }, [initial]);

  const updateServer = async (next: typeof defaultSections) => {
    const { error } = await supabase
      .from('candidate_profiles')
      .update({ visible_sections: next })
      .eq('id', userId);
    if (error) {
      toast({ variant: 'destructive', title: 'Update failed', description: error.message });
    } else {
      toast({ title: 'Saved', description: 'Visibility settings updated.' });
      onChange?.(next);
    }
  };

  const toggle = (key: keyof typeof defaultSections) => {
    const next = { ...sections, [key]: !sections[key] };
    setSections(next);
    updateServer(next);
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">Section Visibility</h3>
        <p className="text-sm text-gray-600 mb-4">Choose which sections employers can see on your full profile.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(sections).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-3 rounded-md border">
              <span className="text-gray-800">{key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
              <Switch checked={!!value} onCheckedChange={() => toggle(key as keyof typeof defaultSections)} />
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
