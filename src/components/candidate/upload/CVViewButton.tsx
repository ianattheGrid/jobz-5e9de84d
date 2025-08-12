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
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const edgeFunctionPromise = supabase.functions.invoke('view-cv', {
        body: { filePath }
      });
      
      // Race between the function call and timeout
      const result = await Promise.race([edgeFunctionPromise, timeoutPromise]);
      const { data, error } = result;
      
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
      
      // Use a small delay to help with popup blocker issues
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const newWindow = window.open(urlWithTimestamp, '_blank');
      
      // Give the window a moment to open, then check if it worked
      setTimeout(() => {
        if (!newWindow || newWindow.closed) {
          console.error('Window failed to open or was blocked');
          toast({ 
            variant: 'destructive', 
            title: 'Popup blocked', 
            description: 'Please allow popups for this site to view CVs.' 
          });
        }
      }, 500);
      
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