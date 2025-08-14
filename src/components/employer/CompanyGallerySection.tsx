
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGalleryImages } from "./gallery/useGalleryImages";
import { X, ZoomIn, ImageIcon } from "lucide-react";

interface CompanyGallerySectionProps {
  employerId: string;
}

export function CompanyGallerySection({ employerId }: CompanyGallerySectionProps) {
  const { images, uploading, uploadImage, deleteImage } = useGalleryImages(employerId);
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">Company Gallery</h3>
      <p className="text-sm text-gray-600 -mt-2 pl-4">
        Showcase your workplace, team events, office culture, and anything that represents your company.
      </p>

      <div className="flex flex-wrap gap-2">
        {images.map((img) => (
          <Dialog key={img.id}>
            <DialogTrigger asChild>
              <div className="relative group cursor-pointer">
                <Card className="overflow-hidden hover:shadow-lg transition-all" style={{width: "250px", height: "250px"}}>
                  <div className="w-full h-full overflow-hidden relative">
                    <img 
                      src={img.image_url} 
                      alt="Company gallery image" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                      loading="lazy" 
                    />
                    
                    {/* Hover overlay with zoom icon */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </Card>
                
                {/* Delete button */}
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-6 w-6 rounded-full text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      deleteImage(img.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full p-4">
              <div className="flex items-center justify-center">
                <img 
                  src={img.image_url} 
                  alt="Company gallery image" 
                  className="max-w-full max-h-[80vh] object-contain rounded-lg" 
                />
              </div>
            </DialogContent>
          </Dialog>
        ))}

        {/* Upload Card */}
        <Card className="border-dashed border-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" style={{width: "250px", height: "250px"}}>
          <CardContent className="p-0 h-full">
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              <div className="flex flex-col items-center justify-center text-center">
                {uploading ? (
                  <div className="animate-pulse text-sm">Uploading...</div>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500 font-semibold">Add Image</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={async (event) => {
                  if (!event.target.files || event.target.files.length === 0) {
                    return;
                  }
                  const file = event.target.files[0];
                  await uploadImage(file);
                  if (event.target) event.target.value = '';
                }}
                disabled={uploading}
              />
            </label>
          </CardContent>
        </Card>
      </div>
      
      <p className="text-sm text-gray-500 mt-2 pl-4">
        Upload images of your workplace, team events, or anything that showcases your company culture. PNG, JPG up to 5MB each.
      </p>
    </div>
  );
}
