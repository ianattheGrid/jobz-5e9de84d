
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, Users } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-32 overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            <span className="text-[#FF69B4]">The recruitment agency</span> in your pocket...
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
            AI changes the game for SMEs. Save thousands per hire. Recruit in a click. Empower anyone to earn. Attract top talent with our "You're hired bonus".
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/employer/signup">
              <Button size="lg" className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white rounded-full px-8">
                <Briefcase className="mr-2 h-5 w-5" />
                Hire Talent
              </Button>
            </Link>
            <Link to="/candidate/signup">
              <Button size="lg" variant="outline" className="bg-transparent border-[#FF69B4] text-[#FF69B4] hover:bg-[#FF69B4]/10 rounded-full px-8">
                <Users className="mr-2 h-5 w-5" />
                Find Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
