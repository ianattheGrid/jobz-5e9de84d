import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase } from "lucide-react";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";

interface CandidateCardPreviewProps {
  profile: CandidateProfile;
}

export function CandidateCardPreview({ profile }: CandidateCardPreviewProps) {
  // Map profile data to card format
  const cardData = {
    name: profile.full_name || 'Your Name',
    title: profile.job_title || 'Your Job Title',
    location: profile.location?.[0] || profile.home_postcode || 'Location',
    experience: profile.years_experience ? `${profile.years_experience}+ years` : 'Experience',
    summary: profile.ai_synopsis || 'Your profile summary will appear here once generated.',
    skills: profile.required_skills || [],
    image: profile.profile_picture_url
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="relative bg-card border-2 border-border overflow-hidden">
        {/* Image/Header Section */}
        <div className="relative h-64 bg-gradient-to-br from-primary/10 to-primary/20">
          {cardData.image ? (
            <img 
              src={cardData.image} 
              alt={cardData.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <span className="text-3xl font-bold text-muted-foreground">
                  {cardData.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">{cardData.name}</h2>
            <p className="text-white/90 drop-shadow">{cardData.title}</p>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{cardData.location}</span>
            <Briefcase className="h-4 w-4 ml-2" />
            <span className="text-sm">{cardData.experience}</span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3">{cardData.summary}</p>
          
          <div className="flex flex-wrap gap-2">
            {cardData.skills.length > 0 ? (
              <>
                {cardData.skills.slice(0, 4).map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {cardData.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{cardData.skills.length - 4} more
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-xs text-muted-foreground italic">Add skills to show here</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
