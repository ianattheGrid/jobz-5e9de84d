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
        className={`absolute inset-0 w-full h-full cursor-pointer transition-transform duration-700 preserve-3d overflow-hidden
          bg-gradient-to-br from-gray-900 via-gray-800 to-black border-gray-700 hover:shadow-2xl hover:shadow-primary/20 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <CardContent className="absolute inset-0 w-full h-full p-6 backface-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="flex flex-col h-full text-white">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <Badge className={`${getTypeColor()} text-white border-0 shadow-lg`}>
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
                <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-primary/20 ring-4 ring-primary shadow-2xl shadow-primary/30">
                  <img src={image} alt={name} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-2xl font-black mb-1 drop-shadow-2xl shadow-black" style={{ color: '#FFFFFF' }}>{name}</h3>
              <p className="text-sm mb-2 font-semibold drop-shadow-lg shadow-black" style={{ color: '#FF69B4' }}>{title}</p>
              {company && (
                <div className="flex items-center justify-center gap-1 text-sm mb-2" style={{ color: '#D1D5DB' }}>
                  <Building className="h-3 w-3" style={{ color: '#FF69B4' }} />
                  <span>{company}</span>
                </div>
              )}
              <div className="flex items-center justify-center gap-1 text-sm" style={{ color: '#D1D5DB' }}>
                <MapPin className="h-3 w-3" style={{ color: '#FF69B4' }} />
                <span>{location}</span>
              </div>
            </div>

            {/* Skills or Specialization */}
            {skills && (
              <div className="mb-4 bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-sm font-medium mb-2 text-primary">Top Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
                      {skill}
                    </Badge>
                  ))}
                  {skills.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      +{skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {specialization && (
              <div className="mb-4 bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-sm font-medium mb-1 text-primary">Specialization:</p>
                <p className="text-sm text-gray-300">{specialization}</p>
              </div>
            )}

            {/* Flip indicator */}
            <div className="mt-auto text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 bg-gray-800/30 rounded-full px-3 py-1">
                <RotateCcw className="h-3 w-3 text-primary" />
                <span>Click to flip for details</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Back of card */}
        <CardContent className="absolute inset-0 w-full h-full p-6 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="flex flex-col h-full text-white">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-black mb-2 drop-shadow-2xl shadow-black" style={{ color: '#FFFFFF' }}>{name}</h3>
              <Badge className={`${getTypeColor()} text-white mb-3 border-0 shadow-xl`}>
                Full Details
              </Badge>
            </div>

            <div className="flex-1 overflow-auto mb-4 bg-gray-800/40 rounded-lg p-4 border border-gray-700/50">
              <p className="text-sm text-gray-200 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Contact Info (if available) */}
            {contactInfo && (
              <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-sm font-medium mb-2 text-primary">Contact Information:</p>
                {contactInfo.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-200 mb-1">
                    <Mail className="h-3 w-3 text-primary" />
                    <span>{contactInfo.email}</span>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-200">
                    <Phone className="h-3 w-3 text-primary" />
                    <span>{contactInfo.phone}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link to={profileLink} onClick={(e) => e.stopPropagation()}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2 text-primary" />
                Back to Summary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};