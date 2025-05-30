
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { CompanyGalleryImage } from "@/types/employer";

export function useGalleryImages(employerId: string) {
  const [images, setImages] = useState<CompanyGalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (employerId) {
      loadImages();
    }
  }, [employerId]);
  
  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('company_gallery')
        .select('*')
        .eq('employer_id', employerId);
        
      if (error) throw error;
      if (data) setImages(data);
    } catch (error: any) {
      console.error('Error loading gallery images:', error.message);
    }
  };
  
  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${employerId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      setUploading(true);
      
      // Upload image to Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('company_images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('company_images')
        .getPublicUrl(filePath);
        
      // Save image record in the database
      const { error: insertError } = await supabase
        .from('company_gallery')
        .insert({
          employer_id: employerId,
          image_url: urlData.publicUrl,
        });
        
      if (insertError) throw insertError;
      
      // Reload images
      await loadImages();
      
      toast({
        title: "Image uploaded",
        description: "Your company gallery has been updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload image",
      });
    } finally {
      setUploading(false);
    }
  };
  
  const deleteImage = async (imageId: string) => {
    try {
      // Get the image record to find the storage path
      const { data: imageData, error: fetchError } = await supabase
        .from('company_gallery')
        .select('image_url')
        .eq('id', imageId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Delete from database first
      const { error: deleteError } = await supabase
        .from('company_gallery')
        .delete()
        .eq('id', imageId);
        
      if (deleteError) throw deleteError;
      
      // Extract file path from URL to delete from storage
      if (imageData && imageData.image_url) {
        const urlParts = imageData.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        await supabase.storage
          .from('company_images')
          .remove([fileName]);
      }
      
      // Update local state
      setImages(images.filter(img => img.id !== imageId));
      
      toast({
        title: "Image deleted",
        description: "The image has been removed from your gallery.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: error.message || "Failed to delete image",
      });
    }
  };

  return {
    images,
    uploading,
    uploadImage,
    deleteImage
  };
}
