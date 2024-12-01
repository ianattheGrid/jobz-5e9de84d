import { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Banknote, MapPin } from "lucide-react";

type Job = Database['public']['Tables']['jobs']['Row'];

export const JobCard = ({ job }: { job: Job }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription className="text-base">{job.company}</CardDescription>
          </div>
          <Badge variant="secondary">{job.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Banknote className="h-4 w-4" />
            <span>£{job.salary_min.toLocaleString()} - £{job.salary_max.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
          {job.candidate_commission && (
            <Badge variant="outline" className="bg-green-50">
              £{job.candidate_commission.toLocaleString()} candidate bonus
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};