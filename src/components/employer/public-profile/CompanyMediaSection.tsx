
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Image, Film } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CompanyMediaSectionProps {
  employerId: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title?: string;
  description?: string;
}

export const CompanyMediaSection = ({ employerId }: CompanyMediaSectionProps) => {
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        // Fetch employer profile to get logo
        const { data: profileData } = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', employerId)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          
          // Add logo as a media item if it exists
          if (profileData.company_logo_url) {
            setMedia([{
              id: 'logo',
              type: 'image',
              url: profileData.company_logo_url,
              title: 'Company Logo',
              description: `${profileData.company_name} logo`
            }]);
          }
        }
        
        // In the future, you would fetch additional media from a company_media table
        // For now, we just use the logo if available
        
      } catch (error) {
        console.error('Error fetching company media:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedia();
  }, [employerId]);
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (media.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Image className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No media available</h3>
            <p className="mt-1 text-sm text-gray-500">
              This company has not uploaded any media content yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">Company Media</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative">
                  {item.type === 'image' ? (
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={item.url} 
                        alt={item.title || 'Company media'} 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  ) : (
                    <AspectRatio ratio={16 / 9}>
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Film className="h-8 w-8 text-gray-400" />
                      </div>
                      {/* Implement video embed once you have actual video content */}
                    </AspectRatio>
                  )}
                </div>
                
                <CardContent className="p-4">
                  {item.title && (
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
