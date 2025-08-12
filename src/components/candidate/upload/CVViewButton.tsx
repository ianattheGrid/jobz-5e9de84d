import React, { useState } from "react";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CVViewButtonProps {
  cvPath: string;
}

export const CVViewButton = ({ cvPath }: CVViewButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  const openCV = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      // Extract just the file path if it's a full URL
      let filePath = cvPath;
      if (cvPath.startsWith('http')) {
        const urlParts = cvPath.split('/cvs/');
        if (urlParts.length > 1) {
          filePath = urlParts[1];
        }
      }
      
      console.log('Opening CV with file path:', filePath);
      
      // Simple direct approach - just open the public URL with current timestamp
      const publicUrl = `https://lfwwhyjtbkfibxzefvkn.supabase.co/storage/v1/object/public/cvs/${filePath}?t=${Date.now()}`;
      console.log('Opening direct URL:', publicUrl);
      
      const newWindow = window.open(publicUrl, '_blank');
      
      if (!newWindow) {
        toast({ 
          variant: 'destructive', 
          title: 'Popup blocked', 
          description: 'Please allow popups for this site to view CVs.' 
        });
      }
      
    } catch (error: any) {
      console.error('Failed to open CV:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Failed to open CV', 
        description: 'Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <FileText className="h-4 w-4 text-blue-600" />
      <button
        type="button"
        onClick={openCV}
        disabled={isLoading}
        className="text-sm text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="View Current CV"
      >
        {isLoading ? 'Opening...' : 'View Current CV'}
      </button>
    </div>
  );
};