import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PortfolioItem {
  id: string;
  candidate_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_name: string;
  created_at: string;
  signed_url?: string;
}

export function useCandidatePortfolio(candidateId: string | null) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const loadPortfolioItems = useCallback(async () => {
    if (!candidateId) return;

    try {
      const { data, error } = await supabase
        .from('candidate_portfolio')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Generate signed URLs for files
      const itemsWithSignedUrls = await Promise.all(
        (data || []).map(async (item) => {
          try {
            const { data: signedUrl } = await supabase.storage
              .from('candidate_portfolio')
              .createSignedUrl(item.file_url, 3600);
            
            return {
              ...item,
              signed_url: signedUrl?.signedUrl || item.file_url
            };
          } catch (error) {
            console.error('Error generating signed URL:', error);
            return item;
          }
        })
      );

      setPortfolioItems(itemsWithSignedUrls);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      toast.error('Failed to load portfolio items');
    }
  }, [candidateId]);

  useEffect(() => {
    loadPortfolioItems();
  }, [loadPortfolioItems]);

  const uploadPortfolioItem = async (
    file: File,
    title: string,
    description: string
  ): Promise<boolean> => {
    if (!candidateId) {
      toast.error('User not authenticated');
      return false;
    }

    setUploading(true);

    try {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return false;
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error('File type not supported. Please upload images, PDFs, or documents.');
        return false;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${candidateId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('candidate_portfolio')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Determine file type category
      let fileType = 'document';
      if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type === 'application/pdf') {
        fileType = 'pdf';
      }

      // Save portfolio item to database
      const { error: dbError } = await supabase
        .from('candidate_portfolio')
        .insert({
          candidate_id: candidateId,
          title,
          description: description || null,
          file_url: fileName,
          file_type: fileType,
          file_name: file.name
        });

      if (dbError) throw dbError;

      toast.success('Portfolio item uploaded successfully');
      await loadPortfolioItems();
      return true;
    } catch (error) {
      console.error('Error uploading portfolio item:', error);
      toast.error('Failed to upload portfolio item');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const deletePortfolioItem = async (itemId: string, fileUrl: string): Promise<void> => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('candidate_portfolio')
        .remove([fileUrl]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('candidate_portfolio')
        .delete()
        .eq('id', itemId);

      if (dbError) throw dbError;

      toast.success('Portfolio item deleted');
      setPortfolioItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      toast.error('Failed to delete portfolio item');
    }
  };

  return {
    portfolioItems,
    uploading,
    uploadPortfolioItem,
    deletePortfolioItem,
    loadPortfolioItems
  };
}