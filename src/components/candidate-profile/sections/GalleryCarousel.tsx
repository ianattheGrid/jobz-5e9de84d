
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useCandidateGallery } from "@/components/candidate/gallery/useCandidateGallery";

interface GalleryCarouselProps {
  candidateId: string;
}

export default function GalleryCarousel({ candidateId }: GalleryCarouselProps) {
  const { images } = useCandidateGallery(candidateId);

  if (!images || images.length === 0) return null;

  return (
    <Card className="shadow-sm border border-gray-200 bg-[#0b1437]">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4 text-primary">Gallery</h3>
        <div className="flex flex-wrap gap-3">
          {images.map((img) => (
            <div key={img.id} className="w-32 h-32 overflow-hidden rounded-md shadow-sm">
              <img
                src={img.signed_url || img.image_url}
                alt="Candidate gallery image"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
