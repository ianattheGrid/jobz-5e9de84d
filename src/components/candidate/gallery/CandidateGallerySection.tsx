
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UploadCard as EmployerUploadCard } from "@/components/employer/gallery/UploadCard";
import { useCandidateGallery } from "./useCandidateGallery";
import { X, ZoomIn } from "lucide-react";

interface CandidateGallerySectionProps {
  candidateId: string;
}

export function CandidateGallerySection({ candidateId }: CandidateGallerySectionProps) {
  const { images, uploading, uploadImage, deleteImage } = useCandidateGallery(candidateId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">Your Gallery</h3>
      <p className="text-sm text-gray-600 -mt-2 pl-4">
        You are more than words—show the human element. Add up to 9 images (running, skiing, building projects, volunteering, etc.).
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((img) => (
          <Card key={img.id} className="overflow-hidden relative group cursor-pointer hover:shadow-lg transition-all">
            <div className="aspect-square overflow-hidden relative">
              <img 
                src={img.signed_url || img.image_url} 
                alt="Candidate gallery image" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                loading="lazy" 
              />
              
              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="h-6 w-6 text-white" />
              </div>
              
              {/* Delete button */}
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-6 w-6 rounded-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteImage(img.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Click handler for expanding image */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="absolute inset-0 cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full p-2">
                <div className="flex items-center justify-center">
                  <img 
                    src={img.signed_url || img.image_url} 
                    alt="Candidate gallery image" 
                    className="max-w-full max-h-[80vh] object-contain rounded-lg" 
                  />
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        ))}

        {images.length < 9 && (
          <div className="aspect-square">
            <EmployerUploadCard onUpload={uploadImage} isUploading={uploading} />
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-1 pl-4">PNG, JPG or WEBP up to 5MB each. Pink arrows and captions will match your theme in preview.</p>
    </div>
  );
}
