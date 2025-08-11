import React from "react";
import { FileText } from "lucide-react";
import { FileUploadButton } from "./FileUploadButton";
import { DeleteFileButton } from "./DeleteFileButton";
import { supabase } from "@/integrations/supabase/client";

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
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Pre-open or reuse a named tab to satisfy popup blockers reliably
                  const tab = window.open('about:blank', 'cv_viewer');
                  try {
                    if (!currentCV) { tab?.close(); return; }

                    try {
                      tab?.document.open();
                      tab?.document.write('<!doctype html><title>Opening CV…</title><body style="font-family:system-ui,sans-serif;padding:24px">Opening your CV…</body>');
                      tab?.document.close();
                    } catch {}

                    let path = currentCV as string;
                    if (path.startsWith('http')) {
                      const parts = path.split('/');
                      const idx = parts.findIndex(p => p === 'cvs');
                      if (idx !== -1) {
                        path = parts.slice(idx + 1).join('/');
                      }
                    }

                    const { data, error } = await supabase.functions.invoke('get-cv-signed-url', {
                      body: { path, expiresIn: 3600 }
                    });
                    if (error) throw error;
                    const signed = (data as any)?.url as string | undefined;
                    if (!signed) throw new Error('No signed URL returned');

                    const viewUrl = `${signed}#v=${Date.now()}`;
                    if (tab) {
                      try { tab.location.replace(viewUrl); }
                      catch {
                        const a = document.createElement('a');
                        a.href = viewUrl; a.target = 'cv_viewer'; a.rel = 'noopener noreferrer';
                        document.body.appendChild(a); a.click(); a.remove();
                      }
                    } else {
                      const a = document.createElement('a');
                      a.href = viewUrl; a.target = '_blank'; a.rel = 'noopener noreferrer';
                      document.body.appendChild(a); a.click(); a.remove();
                    }
                  } catch (err) {
                    console.error('Failed to open CV', err);
                    try { tab?.close(); } catch {}
                  }
                }}
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
