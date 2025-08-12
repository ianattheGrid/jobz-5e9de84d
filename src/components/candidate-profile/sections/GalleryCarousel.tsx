
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCandidateGallery } from "@/components/candidate/gallery/useCandidateGallery";
import { ZoomIn } from "lucide-react";

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
        <div className="relative">
          <Carousel className="px-12">
            <CarouselContent className="-ml-2">
              {images.map((img) => (
                <CarouselItem key={img.id} className="pl-2 basis-1/3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative group cursor-pointer">
                        <div className="overflow-hidden rounded-md shadow-sm hover:shadow-lg transition-all mx-auto" style={{width: "200px", height: "200px"}}>
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
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full p-4">
                      <div className="flex items-center justify-center">
                        <img 
                          src={img.signed_url || img.image_url} 
                          alt="Candidate gallery image" 
                          className="max-w-full max-h-[80vh] object-contain rounded-lg" 
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious variant="outline" className="border-primary text-primary hover:bg-primary/10" />
            <CarouselNext variant="outline" className="border-primary text-primary hover:bg-primary/10" />
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
}
