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
    const clickId = Math.random().toString(36).substr(2, 9);
    console.log(`[${clickId}] === CV CLICK START ===`);
    console.log(`[${clickId}] cvPath:`, cvPath);
    console.log(`[${clickId}] Time:`, new Date().toISOString());
    
    try {
      // Check auth state first
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      console.log(`[${clickId}] Session check:`, { 
        hasSession: !!session?.session, 
        hasToken: !!session?.session?.access_token,
        error: sessionError 
      });
      
      console.log(`[${clickId}] About to call edge function...`);
      const startTime = Date.now();
      
      const { data, error } = await supabase.functions.invoke('get-cv-signed-url', {
        body: { path: cvPath, clickId } // Add unique ID to prevent caching
      });
      
      const endTime = Date.now();
      console.log(`[${clickId}] Edge function completed in ${endTime - startTime}ms`);
      console.log(`[${clickId}] Response:`, { data, error });
      console.log(`[${clickId}] Data keys:`, data ? Object.keys(data) : 'no data');
      console.log(`[${clickId}] Data.signedUrl exists:`, !!data?.signedUrl);
      console.log(`[${clickId}] Data.signedUrl type:`, typeof data?.signedUrl);
      
      if (error) {
        console.error(`[${clickId}] Edge function error:`, error);
        throw error;
      }
      
      if (!data?.signedUrl) {
        console.error(`[${clickId}] No signedUrl in response`);
        throw new Error('No signed URL returned');
      }
      
      console.log(`[${clickId}] Opening URL:`, data.signedUrl.substring(0, 100) + '...');
      window.open(data.signedUrl, '_blank');
      console.log(`[${clickId}] === CV CLICK SUCCESS ===`);
      
    } catch (error) {
      console.error(`[${clickId}] === CV CLICK ERROR ===`);
      console.error(`[${clickId}] Error details:`, error);
      toast({ 
        variant: 'destructive', 
        title: 'Failed to open CV', 
        description: `Error ${clickId}: Please try again.` 
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