import { DemoCardsSection } from "@/components/demo/DemoCardsSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const DemoProfilesSection = () => {
  return (
    <>
      <DemoCardsSection />
      
      {/* Additional CTA Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to Start Matching?</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Experience the full profiles and start connecting with the right opportunities or talent.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/demo/candidate">
              <Button variant="outline">
                View Full Candidate Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo/employer">
              <Button variant="outline">
                View Full Employer Profile
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