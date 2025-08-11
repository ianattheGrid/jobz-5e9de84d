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
                onClick={async () => {
                  // Open a blank tab synchronously to avoid popup blockers
                  const win = window.open('', '_blank');
                  try {
                    if (!currentCV) { win?.close(); return; }

                    // 2) Write a tiny relay page that waits for a postMessage with the URL
                    try {
                      win?.document.open();
                      win?.document.write(`<!doctype html><html><head>
<meta charset="utf-8" />
<title>Opening CV…</title>
<meta name="referrer" content="no-referrer" />
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,\n Noto Sans,sans-serif;margin:24px;color:#111}</style>
</head><body>
<p>Opening your CV…</p>
<script>
  try{
    window.addEventListener('message', function(ev){
      try{
        if(!ev || !ev.data) return;
        if(ev.data.type==='open-url' && ev.data.url){
          var url = ev.data.url;
          // Provide a clickable fallback first
          var a = document.createElement('a');
          a.href = url; a.textContent = 'Open your CV'; a.target = '_self';
          a.rel = 'noopener noreferrer';
          a.style.display = 'inline-block'; a.style.marginTop = '12px';
          document.body.appendChild(a);
          // Attempt direct navigation
          try { window.location.href = url; } catch(e) {}
          // Nudge with a delayed click
          setTimeout(function(){ try{ a.click(); }catch(e){} }, 100);
        }
      }catch(e){}
    });
  }catch(e){}
<\/script>
</body></html>`);
                      win?.document.close();
                    } catch {}

                    // 3) Build storage path (strip bucket prefix if present)
                    let path = currentCV as string;
                    if (path.startsWith('http')) {
                      const parts = path.split('/');
                      const idx = parts.findIndex(p => p === 'cvs');
                      if (idx !== -1) {
                        path = parts.slice(idx + 1).join('/');
                      }
                    }

                    // 4) Get signed URL
                    const { data, error } = await supabase.functions.invoke('get-cv-signed-url', {
                      body: { path, expiresIn: 3600 }
                    });
                    if (error) throw error;
                    const signed = (data as any)?.url as string | undefined;
                    if (!signed) throw new Error('No signed URL returned');

                    // 5) Send the URL to the new tab so it self-navigates
                    const url = `${signed}#ts=${Date.now()}`;
                    if (win) {
                      try { win.postMessage({ type: 'open-url', url }, '*'); } catch {}
                    } else {
                      // Fallback if the tab couldn't be created
                      const a = document.createElement('a');
                      a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
                      document.body.appendChild(a); a.click(); a.remove();
                    }
                  } catch (e) {
                    console.error('Failed to open CV', e);
                    try { win?.close(); } catch {}
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
