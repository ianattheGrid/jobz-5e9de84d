
import { FC } from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileInfo {
  label: string;
  value: string;
}

interface ProfileCardProps {
  profilePicture?: string;
  fullName: string;
  title: string;
  location?: string;
  experience?: string;
  skills?: string[];
  additionalInfo?: ProfileInfo[];
}

export const ProfileCard: FC<ProfileCardProps> = ({
  profilePicture,
  fullName,
  title,
  location,
  experience,
  skills,
  additionalInfo,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-start gap-4 mb-4">
        {profilePicture && (
          <Avatar className="h-16 w-16">
            <AvatarImage src={profilePicture} />
            <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{fullName}</h3>
          <p className="text-gray-600">{title}</p>
          {location && <p className="text-sm text-gray-500 mt-1">{location}</p>}
        </div>
      </div>

      {experience && (
        <div className="mb-4">
          <p className="text-gray-900">{experience}</p>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {additionalInfo.map((info, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{info.label}</p>
              <p className="text-gray-900">{info.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
