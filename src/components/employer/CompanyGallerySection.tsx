
import { GalleryImageCard } from "./gallery/GalleryImageCard";
import { UploadCard } from "./gallery/UploadCard";
import { useGalleryImages } from "./gallery/useGalleryImages";

interface CompanyGallerySectionProps {
  employerId: string;
}

export function CompanyGallerySection({ employerId }: CompanyGallerySectionProps) {
  const { images, uploading, uploadImage, deleteImage } = useGalleryImages(employerId);
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-l-4 border-primary pl-4">Company Gallery</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <GalleryImageCard 
            key={image.id} 
            image={image} 
            onDelete={deleteImage} 
          />
        ))}
        
        {/* Upload Card */}
        <UploadCard 
          onUpload={uploadImage}
          isUploading={uploading}
        />
      </div>
      
      <p className="text-sm text-gray-500 mt-2">
        Upload images of your workplace, team events, or anything that showcases your company culture.
      </p>
    </div>
  );
}
