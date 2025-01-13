import { ProfileCard } from "@/components/shared/ProfileCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Briefcase, Clock, GraduationCap, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";

const DummyCandidateProfile = () => {
  const navigate = useNavigate();

  const dummySkills = [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "AWS",
    "Docker"
  ];

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="space-y-8">
          <ProfileCard
            profilePicture="/placeholder.svg"
            fullName="John Smith"
            title="Senior Software Engineer"
            location="Bristol, UK"
            experience="8 years of experience"
            skills={dummySkills}
          />

          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                Location & Availability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Location</p>
                  <p>Bristol and surrounding areas</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Travel Distance</p>
                  <p>Up to 25 miles</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-primary" />
                Work Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Work Type</p>
                  <p>Hybrid (2-3 days in office)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salary Expectation</p>
                  <p>£65,000 - £85,000</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                Availability & Notice Period
              </h3>
              <div className="space-y-2">
                <Badge variant="secondary">Available Immediately</Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Currently on 1 month notice period
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                Qualifications & Certifications
              </h3>
              <div className="space-y-2">
                <p>BSc Computer Science</p>
                <p>AWS Certified Solutions Architect</p>
                <p>Certified Scrum Master</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-primary" />
                Current Employment
              </h3>
              <div className="space-y-2">
                <p className="font-medium">Tech Solutions Ltd</p>
                <p className="text-sm text-muted-foreground">
                  Looking for new opportunities to advance career and work on challenging projects
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DummyCandidateProfile;