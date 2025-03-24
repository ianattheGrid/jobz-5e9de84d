
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { CompanyGalleryImage } from "@/types/employer";

interface GalleryImageCardProps {
  image: CompanyGalleryImage;
  onDelete: (imageId: string) => void;
}

export function GalleryImageCard({ image, onDelete }: GalleryImageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(image.id);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: error.message || "Failed to delete image",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden relative group">
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
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
