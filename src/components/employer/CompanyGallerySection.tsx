
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { CompanyGalleryImage } from "@/types/employer";

interface CompanyGallerySectionProps {
  employerId: string;
}

export function CompanyGallerySection({ employerId }: CompanyGallerySectionProps) {
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
  
  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
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
      // Reset the file input
      if (event.target) event.target.value = '';
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
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">Company Gallery</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden relative group">
            <div className="aspect-ratio-16/9 w-full h-36 overflow-hidden">
              <img 
                src={image.image_url} 
                alt="Company gallery" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="icon" 
                variant="destructive" 
                className="h-8 w-8 rounded-full"
                onClick={() => deleteImage(image.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        
        {/* Upload Card */}
        <Card className="border-dashed border-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
          <CardContent className="p-0">
            <label className="flex flex-col items-center justify-center w-full h-36 cursor-pointer">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <div className="animate-pulse">Uploading...</div>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (max. 5MB)</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={uploadImage}
                disabled={uploading}
              />
            </label>
          </CardContent>
        </Card>
      </div>
      
      <p className="text-sm text-gray-500 mt-2">
        Upload images of your workplace, team events, or anything that showcases your company culture.
      </p>
    </div>
  );
}
