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
    // Debounce to prevent rapid clicks
    const now = Date.now();
    if (now - lastClickTime < 2000) {
      toast({
        variant: 'destructive',
        title: 'Please wait',
        description: 'Please wait a moment before trying again.'
      });
      return;
    }
    setLastClickTime(now);
    
    if (isLoading) return;
    setIsLoading(true);
    
    let controller: AbortController | null = null;
    
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
      
      // Create a new abort controller for this request
      controller = new AbortController();
      
      // Set up timeout that will abort the request
      const timeoutId = setTimeout(() => {
        if (controller) {
          controller.abort();
        }
      }, 3000); // 3 second timeout
      
      try {
        // Make the edge function call with abort signal
        const response = await fetch(`https://lfwwhyjtbkfibxzefvkn.supabase.co/functions/v1/view-cv`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmd3doeWp0YmtmaWJ4emVmdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNTI1MjQsImV4cCI6MjA0ODYyODUyNH0.R2Zb2y2A6GRkCrZXLcU_h1drMWI9NUZ8tXPUgCdPNAM'
          },
          body: JSON.stringify({ filePath }),
          signal: controller.signal
        });
        
        // Clear the timeout since request completed
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Edge function response:', { data, error: null });
        
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
        
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out - please try again');
        }
        throw fetchError;
      }
      
    } catch (error: any) {
      console.error('Failed to open CV:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Failed to open CV', 
        description: error?.message || 'Please try again.' 
      });
    } finally {
      // Always clean up
      if (controller) {
        controller.abort();
      }
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