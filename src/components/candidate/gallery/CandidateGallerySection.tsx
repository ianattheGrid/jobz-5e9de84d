
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCard as EmployerUploadCard } from "@/components/employer/gallery/UploadCard";
import { useCandidateGallery } from "./useCandidateGallery";
import { X } from "lucide-react";

interface CandidateGallerySectionProps {
  candidateId: string;
}

export function CandidateGallerySection({ candidateId }: CandidateGallerySectionProps) {
  const { images, uploading, uploadImage, deleteImage } = useCandidateGallery(candidateId);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">Your Gallery</h3>
      <p className="text-sm text-gray-600 -mt-2 pl-4">
        You are more than words—show the human element. Add up to 9 images (running, skiing, building projects, volunteering, etc.).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <Card key={img.id} className="overflow-hidden relative group">
            <div className="w-full h-36 overflow-hidden">
              <img src={img.image_url} alt="Candidate gallery image" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 rounded-full"
                onClick={() => deleteImage(img.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        {images.length < 9 && (
          <EmployerUploadCard onUpload={uploadImage} isUploading={uploading} />
        )}
      </div>

      <p className="text-xs text-gray-500 mt-1 pl-4">PNG, JPG or WEBP up to 5MB each. Pink arrows and captions will match your theme in preview.</p>
    </div>
  );
}
