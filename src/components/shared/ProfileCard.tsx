import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProfileCardProps {
  profilePicture?: string | null;
  fullName: string;
  title: string;
  location?: string;
  experience?: string;
  skills?: string[];
  additionalInfo?: {
    label: string;
    value: string | number;
  }[];
  children?: React.ReactNode;
}

export const ProfileCard = ({
  profilePicture,
  fullName,
  title,
  location,
  experience,
  skills,
  additionalInfo,
  children
}: ProfileCardProps) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="relative pb-0">
        <div className="flex items-start gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profilePicture || undefined} />
            <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{fullName}</h2>
            <p className="text-lg text-muted-foreground">{title}</p>
            {location && (
              <p className="text-sm text-muted-foreground mt-1">
                {location}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {experience && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Experience</h3>
            <p className="text-muted-foreground">{experience}</p>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {additionalInfo && additionalInfo.length > 0 && (
          <div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              {additionalInfo.map((info, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-muted-foreground">{info.label}</p>
                  <p className="font-medium">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {children}
      </CardContent>
    </Card>
  );
};