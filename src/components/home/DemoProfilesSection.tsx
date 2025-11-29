import { DemoCardsSection } from "@/components/demo/DemoCardsSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import astronautMarsImage from "@/assets/astronaut-mars.jpg";

export const DemoProfilesSection = () => {
  return (
    <>
      <DemoCardsSection />
      
      {/* Demo Profile Navigation Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${astronautMarsImage})` }}
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h3 className="text-2xl font-semibold mb-4 text-white">Explore Demo Profiles</h3>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Experience the full profiles and see how Jobz works for each user type.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/demo/candidate">
              <Button 
                variant="ghost" 
                className="text-white border border-white/30 hover:bg-white/10 hover:border-white/50 hover:text-white transition-all"
              >
                View Candidate Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo/employer">
              <Button 
                variant="ghost" 
                className="text-white border border-white/30 hover:bg-white/10 hover:border-white/50 hover:text-white transition-all"
              >
                View Employer Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo/virtual-recruiter">
              <Button 
                variant="ghost" 
                className="text-white border border-white/30 hover:bg-white/10 hover:border-white/50 hover:text-white transition-all"
              >
                Meet Connector
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};