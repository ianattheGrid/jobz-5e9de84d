import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { formatBenefits } from "./utils";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Job = Database['public']['Tables']['jobs']['Row'];

interface JobCardBackProps {
  job: Job;
}

const JobCardBack = ({ job }: JobCardBackProps) => {
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Error",
          description: "Please sign in to apply",
          variant: "destructive",
        });
        return;
      }

      let resumeUrl = "";
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('resumes')
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;
        resumeUrl = data.path;
      }

      const { error } = await supabase.from('applications').insert({
        job_id: job.id,
        applicant_id: session.user.id,
        resume_url: resumeUrl,
        cover_letter: coverLetter,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application submitted successfully",
      });
      setIsApplying(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm h-full overflow-y-auto">
      <h3 className="text-xl font-semibold text-primary mb-4">{job.title}</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Full Description</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Benefits</h4>
          <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
            <li>Holiday Entitlement: {job.holiday_entitlement || 25} days</li>
            {formatBenefits(job.company_benefits).map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>

        <div>
          {!isApplying ? (
            <Button 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsApplying(true);
              }}
            >
              Apply Now
            </Button>
          ) : (
            <form onSubmit={handleApply} onClick={(e) => e.stopPropagation()} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Resume</label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Letter</label>
                <Textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write your cover letter..."
                  className="h-32"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">Submit Application</Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsApplying(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCardBack;