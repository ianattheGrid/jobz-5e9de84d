import React, { useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Heart, Star, MapPin, Briefcase } from "lucide-react";

interface SwipeCardProps {
  data: any;
  onSwipe: (direction: 'left' | 'right') => void;
  type: 'candidate' | 'employer';
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ data, onSwipe, type }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setCurrentX(deltaX);
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
      cardRef.current.style.opacity = `${Math.max(0.5, 1 - Math.abs(deltaX) / 300)}`;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(currentX) > 150) {
      const direction = currentX > 0 ? 'right' : 'left';
      onSwipe(direction);
    } else {
      // Snap back
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
        cardRef.current.style.opacity = '1';
      }
    }
    setCurrentX(0);
  };

  const handleAction = (action: 'pass' | 'like') => {
    const direction = action === 'like' ? 'right' : 'left';
    onSwipe(direction);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <Card
        ref={cardRef}
        className="relative bg-white border-2 border-border cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg"
        style={{ 
          transformOrigin: 'center bottom',
          transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Swipe indicators */}
        <div className={`absolute inset-0 bg-green-500/20 flex items-center justify-center transition-opacity ${currentX > 50 ? 'opacity-100' : 'opacity-0'}`}>
          <Heart className="h-16 w-16 text-green-500" />
        </div>
        <div className={`absolute inset-0 bg-red-500/20 flex items-center justify-center transition-opacity ${currentX < -50 ? 'opacity-100' : 'opacity-0'}`}>
          <X className="h-16 w-16 text-red-500" />
        </div>

        {type === 'candidate' ? (
          <CandidateCard data={data} />
        ) : (
          <EmployerCard data={data} />
        )}

        {/* Action buttons */}
        <div className="flex justify-center gap-4 p-4 bg-muted/50">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-16 h-16 border-red-200 hover:bg-red-50"
            onClick={() => handleAction('pass')}
          >
            <X className="h-6 w-6 text-red-500" />
          </Button>
          <Button
            size="lg"
            className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90"
            onClick={() => handleAction('like')}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

const CandidateCard: React.FC<{ data: any }> = ({ data }) => (
  <>
    <div className="relative h-64 bg-gradient-to-br from-primary/10 to-primary/20">
      {data.image && (
        <img 
          src={data.image} 
          alt={data.name}
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute bottom-4 left-4 right-4">
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">{data.name}</h2>
        <p className="text-white/90 drop-shadow">{data.title}</p>
      </div>
    </div>
    
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span className="text-sm">{data.location}</span>
        <Briefcase className="h-4 w-4 ml-2" />
        <span className="text-sm">{data.experience}</span>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-3">{data.summary}</p>
      
      <div className="flex flex-wrap gap-2">
        {data.skills?.slice(0, 4).map((skill: string, index: number) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
        {data.skills?.length > 4 && (
          <Badge variant="outline" className="text-xs">
            +{data.skills.length - 4} more
          </Badge>
        )}
      </div>
    </div>
  </>
);

const EmployerCard: React.FC<{ data: any }> = ({ data }) => (
  <>
    <div className="relative h-64 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl font-bold text-primary">{data.name.charAt(0)}</span>
        </div>
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">{data.name}</h2>
        <p className="text-white/90 drop-shadow">{data.industry}</p>
      </div>
    </div>
    
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span className="text-sm">{data.location}</span>
        <Star className="h-4 w-4 ml-2" />
        <span className="text-sm">{data.employees} employees</span>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-3">{data.description}</p>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">Open Positions:</p>
        <div className="flex flex-wrap gap-2">
          {data.openPositions?.slice(0, 3).map((position: any, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {position.title}
            </Badge>
          ))}
          {data.openPositions?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{data.openPositions.length - 3} more
            </Badge>
          )}
        </div>
      </div>
    </div>
  </>
);