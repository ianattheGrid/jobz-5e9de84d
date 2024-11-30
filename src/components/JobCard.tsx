import { Briefcase, Building2, MapPin } from "lucide-react";
import { Card } from "./ui/card";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  description: string;
  onSwipe: (direction: "left" | "right") => void;
}

const JobCard = ({ title, company, location, description, onSwipe }: JobCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-xl transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <div className="flex items-center space-x-2 text-gray-600 mt-1">
              <Building2 className="w-4 h-4" />
              <span>{company}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
          <Briefcase className="w-8 h-8 text-primary-DEFAULT" />
        </div>
        
        <p className="text-gray-600">{description}</p>
        
        <div className="flex justify-between pt-4">
          <button
            onClick={() => onSwipe("left")}
            className="px-6 py-2 rounded-full border-2 border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
          >
            Pass
          </button>
          <button
            onClick={() => onSwipe("right")}
            className="px-6 py-2 rounded-full bg-primary-DEFAULT text-white hover:bg-primary-dark transition-colors"
          >
            Like
          </button>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;