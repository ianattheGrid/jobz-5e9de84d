import { Link } from "react-router-dom";
import { Building2, ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FoundAdvert, advertClaimLink, openAdvert } from "@/utils/externalJobs";

interface ExternalJobCardProps {
  job: FoundAdvert;
  candidateId?: string | null;
}

/**
 * An advert we found on a company's own careers page. Deliberately quieter than
 * a Jobz vacancy: no Apply, no match score, no employer profile — we just point
 * people at the company's own advert.
 */
const ExternalJobCard = ({ job, candidateId }: ExternalJobCardProps) => {
  const company = job.target_companies?.company_name || "A Bristol employer";

  return (
    <Card className="h-full flex flex-col border-dashed">
      <CardHeader className="space-y-2">
        <Badge variant="outline" className="w-fit text-xs font-normal">
          Found on their careers page
        </Badge>
        <CardTitle className="text-lg leading-snug">{job.job_title}</CardTitle>
        <div className="text-sm text-muted-foreground space-y-1">
          <span className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {company}
          </span>
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="mt-auto space-y-3">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={() => openAdvert(job, candidateId)}
        >
          <ExternalLink className="h-4 w-4" />
          View their advert
        </Button>

        <p className="text-xs text-muted-foreground border-t border-border pt-3">
          Are you {company}?{" "}
          <Link to={advertClaimLink(job)} className="text-primary underline underline-offset-2">
            Claim this role on Jobz
          </Link>{" "}
          — £9 a month, no contract, no commission.
        </p>
      </CardContent>
    </Card>
  );
};

export default ExternalJobCard;
