import React from "react";
import { FileText } from "lucide-react";
import { FileUploadButton } from "./FileUploadButton";
import { DeleteFileButton } from "./DeleteFileButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CVUploadProps {
  currentCV: string | null;
  uploadingCV: boolean;
  deletingCV: boolean;
  uploadSuccess: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

export const CVUpload = ({
  currentCV,
  uploadingCV,
  deletingCV,
  uploadSuccess,
  onUpload,
  onDelete
}: CVUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  const cvPath = React.useMemo(() => {
    if (!currentCV) return '';
    
    // Extract the path after 'cvs/' from any URL format
    let path = currentCV as string;
    
    if (path.includes('/storage/v1/object/')) {
      const parts = path.split('/');
      const cvsIndex = parts.findIndex(part => part === 'cvs');
      if (cvsIndex !== -1 && cvsIndex < parts.length - 1) {
        // Get everything after 'cvs/' - this should be userId/filename.ext
        path = parts.slice(cvsIndex + 1).join('/');
      }
    }
    
    console.log('CVUpload - Original CV URL:', currentCV);
    console.log('CVUpload - Extracted CV path for edge function:', path);
    
    return path;
  }, [currentCV]);

  const { toast } = useToast();

  const handleOpenCurrentCV = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    console.log('handleOpenCurrentCV called, cvPath:', cvPath);
    
    if (!cvPath) {
      toast({ variant: 'destructive', title: 'No CV found', description: 'Please upload your CV first.' });
      return;
    }
    
    try {
      console.log('Calling edge function with path:', cvPath);
      
      // Get signed URL from edge function
      const { data, error } = await supabase.functions.invoke('get-cv-signed-url', {
        body: { path: cvPath, expiresIn: 3600 }
      });
      
      console.log('Edge function response:', { data, error });
      
      if (error) throw error;
      if (!data?.url) throw new Error('No signed URL returned');
      
      console.log('Opening URL:', data.url);
      
      // Open PDF in new tab
      const opened = window.open(data.url, '_blank', 'noopener,noreferrer');
      if (!opened) {
        throw new Error('Pop-up blocked or failed to open');
      }
    } catch (error) {
      console.error('Failed to open CV:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Failed to open CV', 
        description: 'Please try again or re-upload your CV.' 
      });
    }
  };
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-900">CV / Resume</div>
      <div className="flex items-center gap-4">
        <FileUploadButton
          id="cv-input"
          uploading={uploadingCV}
          success={uploadSuccess}
          onButtonClick={() => document.getElementById('cv-input')?.click()}
          label="Upload CV"
          accept=".pdf,.doc,.docx"
          disabled={deletingCV}
        />

        {currentCV && (
          <>
            <DeleteFileButton
              deleting={deletingCV}
              onDelete={onDelete}
              disabled={uploadingCV}
            />

            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <button
                type="button"
                onClick={handleOpenCurrentCV}
                className="text-sm text-blue-600 hover:underline"
                aria-label="View Current CV"
              >
                View Current CV
              </button>
            </div>
          </>
        )}

        <input
          type="file"
          id="cv-input"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <div className="text-xs text-gray-500">
        Supported formats: PDF, DOC, DOCX. For best results, use PDF format with selectable text.
      </div>
    </div>
  );
};
