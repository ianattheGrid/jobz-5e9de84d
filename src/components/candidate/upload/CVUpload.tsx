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
  const openingRef = React.useRef(false);
  const lastBlobUrlRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    return () => {
      if (lastBlobUrlRef.current) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
        lastBlobUrlRef.current = null;
      }
    };
  }, []);

  const handleOpenCurrentCV = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (openingRef.current) return;
    if (!cvPath) {
      toast({
        variant: 'destructive',
        title: 'No CV found',
        description: 'Please upload your CV first.',
      });
      return;
    }
    openingRef.current = true;
    const viewerUrl = `/cv-view?path=${encodeURIComponent(cvPath)}&t=${Date.now()}`;
    const newTab = window.open('about:blank', '_blank', 'noopener');
    if (!newTab) {
      toast({
        variant: 'destructive',
        title: 'Pop-up blocked',
        description: 'Allow pop-ups for this site to view your CV. Redirecting...',
      });
      window.location.href = viewerUrl;
      openingRef.current = false;
      return;
    }

    // Show quick placeholder while loading
    try {
      newTab.document.write(`
        <html><head><title>Opening CV…</title></head>
        <body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 24px;">
        <h1 style="font-size: 18px; margin: 0 0 8px;">Opening your CV…</h1>
        <p style="color:#555;margin:0;">Please wait.</p>
        </body></html>
      `);
      newTab.document.close();
    } catch {}

    try {
      // Try downloading via authenticated Storage (best UX)
      const { data: blob, error } = await supabase.storage.from('cvs').download(cvPath);
      if (error) throw error;
      if (lastBlobUrlRef.current) {
        URL.revokeObjectURL(lastBlobUrlRef.current);
        lastBlobUrlRef.current = null;
      }
      const blobUrl = URL.createObjectURL(blob);
      lastBlobUrlRef.current = blobUrl;
      newTab.location.replace(`${blobUrl}#v=${Date.now()}`);
      openingRef.current = false;
      return;
    } catch (err) {
      console.warn('Storage download failed, falling back to signed URL', err);
    }

    try {
      // Fallback: get signed URL via Edge Function
      const { data: s } = await supabase.auth.getSession();
      const accessToken = s.session?.access_token;
      const { data, error } = await supabase.functions.invoke('get-cv-signed-url', {
        body: { path: cvPath, expiresIn: 3600 },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      if (error) throw error;
      const url = (data as any)?.url as string | undefined;
      if (!url) throw new Error('No URL returned');
      newTab.location.replace(`${url}#v=${Date.now()}`);
    } catch (err) {
      console.error('Failed to open CV', err);
      try {
        newTab.document.body.innerHTML = `
          <h1 style="font-family: system-ui; font-size:18px;">We couldn’t open your CV</h1>
          <p style="font-family: system-ui; color:#555;">Please try again, or re-upload it.</p>
        `;
      } catch {}
      toast({
        variant: 'destructive',
        title: "Couldn't open CV",
        description: 'Please try again, or re-upload your CV.',
      });
    } finally {
      openingRef.current = false;
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
