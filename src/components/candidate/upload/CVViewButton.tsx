import React from "react";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CVViewButtonProps {
  cvPath: string;
}

export const CVViewButton = ({ cvPath }: CVViewButtonProps) => {
  const { toast } = useToast();

  const openCV = () => {
    // If it's already a full URL, use it directly
    if (cvPath.startsWith('http')) {
      window.open(cvPath, '_blank');
      return;
    }
    
    // Otherwise construct the public URL
    const publicUrl = `https://lfwwhyjtbkfibxzefvkn.supabase.co/storage/v1/object/public/cvs/${cvPath}`;
    window.open(publicUrl, '_blank');
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