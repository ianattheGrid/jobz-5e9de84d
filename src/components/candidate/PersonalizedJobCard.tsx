import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, DollarSign, Calendar, Star } from "lucide-react";
import { Job } from "@/integrations/supabase/types/jobs";

interface JobWithScore extends Job {
  matchScore?: number;
}

interface PersonalizedJobCardProps {
  job: JobWithScore;
}

export const PersonalizedJobCard = ({ job }: PersonalizedJobCardProps) => {
  const navigate = useNavigate();

  const formatSalary = (min: number, max: number) => {
    return `£${min.toLocaleString()} - £${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Posted 1 day ago";
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    return `Posted ${Math.ceil(diffDays / 7)} weeks ago`;
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {job.title}
          </CardTitle>
          {job.matchScore && (
            <Badge className={`${getMatchColor(job.matchScore)} flex items-center gap-1`}>
              <Star className="w-3 h-3" />
              {job.matchScore}% match
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-600">{job.company}</div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          {formatSalary(job.salary_min, job.salary_max)}
        </div>
        
        {job.holiday_entitlement && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {job.holiday_entitlement} days holiday
          </div>
        )}
        
        {job.type && (
          <Badge variant="secondary" className="text-xs">
            {job.type}
          </Badge>
        )}
        
        <div className="text-sm text-gray-600 line-clamp-2">
          {job.description}
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-gray-500">
            {formatDate(job.created_at)}
          </span>
          <Button
            size="sm"
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};