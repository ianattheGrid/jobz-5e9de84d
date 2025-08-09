
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface CandidateGalleryImage {
  id: string;
  candidate_id: string;
  image_url: string;
  created_at: string;
  signed_url?: string;
}

export function useCandidateGallery(candidateId: string | null) {
  const [images, setImages] = useState<CandidateGalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const toPath = (fullUrl: string) => {
    const marker = '/candidate_gallery/';
    const idx = fullUrl.indexOf(marker);
    return idx === -1 ? '' : fullUrl.substring(idx + marker.length);
  };

  const loadImages = useCallback(async () => {
    if (!candidateId) return;
    try {
      const { data, error } = await supabase
        .from('candidate_gallery')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });
      if (error) throw error;

      const withSigned = await Promise.all((data || []).map(async (img) => {
        const path = toPath(img.image_url);
        if (!path) return img;
        const { data: signed } = await supabase.storage
          .from('candidate_gallery')
          .createSignedUrl(path, 60 * 60); // 1 hour
        return { ...img, signed_url: signed?.signedUrl || img.image_url };
      }));

      setImages(withSigned);
    } catch (err: any) {
      console.error('Error loading candidate gallery:', err);
    }
  }, [candidateId]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const uploadImage = async (file: File) => {
    if (!candidateId) return;
    if (images.length >= 9) {
      toast({ variant: "destructive", title: "Limit reached", description: "You can upload up to 9 images." });
      return;
    }
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${candidateId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('candidate_gallery')
        .upload(filePath, file, { upsert: false });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('candidate_gallery')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('candidate_gallery')
        .insert({ candidate_id: candidateId, image_url: urlData.publicUrl });
      if (insertError) throw insertError;

      await loadImages();
      toast({ title: "Image uploaded", description: "Added to your gallery." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Upload failed", description: err.message || 'Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      const img = images.find(i => i.id === imageId);
      const { error: deleteDbError } = await supabase
        .from('candidate_gallery')
        .delete()
        .eq('id', imageId);
      if (deleteDbError) throw deleteDbError;

      if (img?.image_url) {
        const path = toPath(img.image_url);
        if (path) {
          await supabase.storage.from('candidate_gallery').remove([path]);
        }
      }

      setImages(prev => prev.filter(i => i.id !== imageId));
      toast({ title: "Image deleted", description: "Removed from your gallery." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Deletion failed", description: err.message || 'Please try again.' });
    }
  };

  return { images, uploading, uploadImage, deleteImage };
}
