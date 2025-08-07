import { DemoCardsSection } from "@/components/demo/DemoCardsSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const DemoProfilesSection = () => {
  return (
    <>
      <DemoCardsSection />
      
      {/* Demo Profile Navigation Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-4">Explore Demo Profiles</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Experience the full profiles and see how jobz works for each user type.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/demo/candidate">
              <Button variant="outline">
                View Candidate Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo/employer">
              <Button variant="outline">
                View Employer Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo/virtual-recruiter">
              <Button variant="outline">
                Meet Virtual Recruiter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};