import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn, Image } from "lucide-react";
import type { CompanyGalleryImage } from "@/types/employer";

interface CompanyGalleryCarouselProps {
  galleryImages: CompanyGalleryImage[];
}

export function CompanyGalleryCarousel({ galleryImages }: CompanyGalleryCarouselProps) {
  if (!galleryImages || galleryImages.length === 0) return null;

  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
          <Image className="h-5 w-5 mr-2 text-pink-500" />
          Company Gallery
        </h3>
        <div className="relative">
          <Carousel className="px-12">
            <CarouselContent className="-ml-2">
              {galleryImages.map((img) => (
                <CarouselItem key={img.id} className="pl-2 basis-1/3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative group cursor-pointer">
                        <div className="overflow-hidden rounded-md shadow-sm hover:shadow-lg transition-all mx-auto" style={{width: "250px", height: "250px"}}>
                          <img
                            src={img.image_url}
                            alt="Company gallery image"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              filter: 'none',
                              transform: 'none',
                              mixBlendMode: 'normal',
                              opacity: '1'
                            }}
                            className="transition-transform group-hover:scale-105"
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
                          src={img.image_url} 
                          alt="Company gallery image" 
                          style={{
                            maxWidth: '100%',
                            maxHeight: '80vh',
                            objectFit: 'contain',
                            filter: 'none',
                            transform: 'none',
                            mixBlendMode: 'normal',
                            opacity: '1'
                          }}
                          className="rounded-lg"
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