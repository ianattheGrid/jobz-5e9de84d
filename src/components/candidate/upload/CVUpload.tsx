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
    let p = currentCV as string;
    if (p.startsWith('http')) {
      const parts = p.split('/');
      const idx = parts.findIndex((x) => x === 'cvs');
      if (idx !== -1) p = parts.slice(idx + 1).join('/');
    }
    return p;
  }, [currentCV]);

  const { toast } = useToast();
  const handleOpenCurrentCV = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      if (!cvPath) throw new Error('No CV found');
      const { data, error } = await supabase.functions.invoke('get-cv-signed-url', {
        body: { path: cvPath, expiresIn: 3600 }
      });
      if (error) throw error as any;
      const url = (data as any)?.url as string | undefined;
      if (!url) throw new Error('No signed URL returned');
      window.open(`${url}#v=${Date.now()}`, '_blank', 'noopener');
    } catch (err) {
      console.error('Failed to open CV via function', err);
      try {
        const { data: signed, error: signErr } = await supabase.storage.from('cvs').createSignedUrl(cvPath, 3600);
        if (signErr) throw signErr;
        if (signed?.signedUrl) {
          window.open(`${signed.signedUrl}#v=${Date.now()}`, '_blank', 'noopener');
          return;
        }
        throw new Error('No signed URL from storage');
      } catch (fallbackErr) {
        console.error('Fallback sign failed', fallbackErr);
        toast({
          variant: 'destructive',
          title: 'Unable to open CV',
          description: 'Please try again or re-upload your CV.',
        });
      }
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
