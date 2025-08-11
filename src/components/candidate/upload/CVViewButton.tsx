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
      
      // Always use the edge function - never try direct storage access
      const { data, error } = await supabase.functions.invoke('view-cv', {
        body: { filePath }
      });
      
      console.log('Edge function response:', { data, error });
      
      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }
      
      if (!data?.signedUrl) {
        console.error('No signed URL in response:', data);
        throw new Error('No signed URL returned');
      }
      
      console.log('Opening URL:', data.signedUrl);
      
      // Open the PDF in a new tab with a unique timestamp to avoid caching
      const urlWithTimestamp = `${data.signedUrl}&t=${Date.now()}`;
      const newWindow = window.open(urlWithTimestamp, '_blank');
      
      // Ensure the window opened successfully
      if (!newWindow) {
        throw new Error('Failed to open PDF window - please check popup blocker');
      }
      
    } catch (error) {
      console.error('Failed to open CV:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Failed to open CV', 
        description: error instanceof Error ? error.message : 'Please try again.' 
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