import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Building, 
  Star, 
  RotateCcw, 
  Eye, 
  Mail, 
  Phone,
  ExternalLink 
} from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileCardProps {
  type: "candidate" | "employer" | "virtual-recruiter";
  name: string;
  title: string;
  location: string;
  image?: string;
  rating?: number;
  company?: string;
  skills?: string[];
  specialization?: string;
  description: string;
  profileLink: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

export const ProfileCard = ({ 
  type, 
  name, 
  title, 
  location, 
  image, 
  rating, 
  company, 
  skills, 
  specialization,
  description,
  profileLink,
  contactInfo 
}: ProfileCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const getTypeColor = () => {
    switch (type) {
      case "candidate": return "bg-blue-500";
      case "employer": return "bg-green-500";
      case "virtual-recruiter": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "candidate": return "Candidate";
      case "employer": return "Employer";
      case "virtual-recruiter": return "Virtual Recruiter";
      default: return "Profile";
    }
  };

  return (
    <div className="relative w-full h-96 perspective-1000">
      <Card 
        className={`absolute inset-0 w-full h-full cursor-pointer transition-transform duration-700 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <CardContent className="absolute inset-0 w-full h-full p-6 backface-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <Badge className={`${getTypeColor()} text-white`}>
                {getTypeLabel()}
              </Badge>
              {rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{rating}</span>
                </div>
              )}
            </div>

            {/* Profile Image & Basic Info */}
            <div className="text-center mb-4">
              {image && (
                <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-100">
                  <img src={image} alt={name} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-lg font-semibold mb-1">{name}</h3>
              <p className="text-muted-foreground text-sm mb-2">{title}</p>
              {company && (
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-2">
                  <Building className="h-3 w-3" />
                  <span>{company}</span>
                </div>
              )}
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
            </div>

            {/* Skills or Specialization */}
            {skills && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Top Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {specialization && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Specialization:</p>
                <p className="text-sm text-muted-foreground">{specialization}</p>
              </div>
            )}

            {/* Flip indicator */}
            <div className="mt-auto text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <RotateCcw className="h-3 w-3" />
                <span>Click to flip for details</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Back of card */}
        <CardContent className="absolute inset-0 w-full h-full p-6 backface-hidden rotate-y-180 bg-gray-50">
          <div className="flex flex-col h-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2">{name}</h3>
              <Badge className={`${getTypeColor()} text-white mb-3`}>
                Full Details
              </Badge>
            </div>

            <div className="flex-1 overflow-auto mb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Contact Info (if available) */}
            {contactInfo && (
              <div className="mb-4 p-3 bg-white rounded-lg border">
                <p className="text-sm font-medium mb-2">Contact Information:</p>
                {contactInfo.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Mail className="h-3 w-3" />
                    <span>{contactInfo.email}</span>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{contactInfo.phone}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link to={profileLink} onClick={(e) => e.stopPropagation()}>
                <Button className="w-full" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Back to Summary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};