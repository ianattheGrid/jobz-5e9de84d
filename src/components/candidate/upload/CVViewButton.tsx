import React from "react";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CVViewButtonProps {
  cvPath: string;
}

export const CVViewButton = ({ cvPath }: CVViewButtonProps) => {
  const { toast } = useToast();

  const openCV = async () => {
    try {
      // Extract just the file path if it's a full URL
      let filePath = cvPath;
      if (cvPath.startsWith('http')) {
        const urlParts = cvPath.split('/cvs/');
        if (urlParts.length > 1) {
          filePath = urlParts[1];
        }
      }
      
      const { data, error } = await supabase.rpc('get_cv_signed_url', {
        file_path: filePath,
        expires_in: 3600
      });
      
      if (error) throw error;
      
      const result = data as { error?: string; signedUrl?: string };
      if (result?.error) throw new Error(result.error);
      if (!result?.signedUrl) throw new Error('No signed URL returned');
      
      window.open(result.signedUrl, '_blank');
      
    } catch (error) {
      console.error('Failed to open CV:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Failed to open CV', 
        description: 'Please try again.' 
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <FileText className="h-4 w-4 text-blue-600" />
      <button
        type="button"
        onClick={openCV}
        className="text-sm text-blue-600 hover:underline"
        aria-label="View Current CV"
      >
        View Current CV
      </button>
    </div>
  );
};