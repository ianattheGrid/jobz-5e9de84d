import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UploadCloud } from "lucide-react";

interface CreateFromCVButtonProps {
  cvUrl: string | null;
  userId: string | null;
  onComplete?: () => void;
}

export const CreateFromCVButton = ({ cvUrl, userId, onComplete }: CreateFromCVButtonProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!cvUrl) {
      toast({
        variant: "destructive",
        title: "No CV found",
        description: "Please upload your CV first, then try again.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = userId || session?.user?.id;
      const fallbackEmail = session?.user?.email || undefined;

      if (!uid) {
        toast({ variant: "destructive", title: "Not signed in", description: "Please sign in to continue." });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('parse-cv', {
        body: { fileUrl: cvUrl, requiredSkills: [], debug: false }
      });

      if (error || (data && (data as any).error)) {
        throw new Error((error as any)?.message || (data as any)?.error || 'Failed to parse CV');
      }

      const structured = (data as any)?.structured || {};

      const profileUpdate = {
        id: uid as string,
        full_name: structured.fullName || undefined,
        email: (structured.email || fallbackEmail) as string,
        phone_number: structured.phone || undefined,
        linkedin_url: structured.linkedin || undefined,
        location: Array.isArray(structured.location) ? structured.location : [],
        job_title: JSON.stringify(structured.jobTitles || []),
        years_experience: typeof structured.yearsExperience === 'number' ? structured.yearsExperience : 0,
        min_salary: 0,
        max_salary: 0,
      } as const;

      const { error: upsertError } = await supabase
        .from('candidate_profiles')
        .upsert(profileUpdate as any, { onConflict: 'id' });

      if (upsertError) throw upsertError;

      toast({ title: "Profile draft created", description: "We filled your profile from your CV. Please review and save." });
      onComplete?.();
    } catch (e: any) {
      console.error('Create from CV error', e);
      toast({ variant: "destructive", title: "Could not create profile", description: e?.message || 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <Button onClick={handleCreate} disabled={loading} className="bg-pink-500 hover:bg-pink-600 text-white">
        <UploadCloud className="h-4 w-4 mr-2" />
        {loading ? 'Creating from CV…' : 'Create profile from CV'}
      </Button>
      <p className="text-xs text-gray-500">Rules-based extraction. You can edit anything after prefill.</p>
    </div>
  );
};
