import { Shield, Target, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface WebbyFeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const WebbyFeatureCard = ({ icon: Icon, title, description }: WebbyFeatureCardProps) => (
  <div className="group relative p-6 rounded-2xl bg-white shadow-lg border border-slate-200 hover:border-primary/50 transition-all duration-300 hover:shadow-xl animate-fade-in">
    <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="relative">
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export const WebbySection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[600px] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Soft gradient blobs for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"
        />
      </div>
      
      {/* Main content */}
      <div className="relative container mx-auto px-4 py-20">
        {/* Central Webby "orb" with glow animation */}
        <div className="flex justify-center mb-12 animate-fade-in">
          <div className="relative">
            {/* Outer glow ring - more visible on light background */}
            <div className="absolute inset-0 w-32 h-32 -m-4 rounded-full bg-primary/30 blur-3xl animate-pulse-glow" />
            
            {/* Main glowing orb */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary via-[hsl(var(--brand-purple))] to-[hsl(var(--brand-blue))] shadow-2xl animate-pulse-glow flex items-center justify-center">
              {/* Sparkle icon overlay */}
              <Sparkles className="text-white w-12 h-12 animate-pulse" />
            </div>
            
            {/* Orbital particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute w-2 h-2 bg-primary rounded-full shadow-lg"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 60}deg) translateY(-50px)`,
                  animation: `float 3s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Headlines */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-4xl md:text-6xl font-bold text-center text-slate-900 mb-4">
            Meet <span className="text-primary">Webby</span>. Your AI Navigator.
          </h2>
          <p className="text-xl md:text-2xl text-center text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed">
            Let AI chart your course through the job search universe—without exposing your coordinates.
          </p>
        </div>
        
        {/* Three pillars - floating cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          <WebbyFeatureCard 
            icon={Shield}
            title="Stealth Mode"
            description="Explore opportunities anonymously. Your identity stays cloaked until you're ready to reveal."
          />
          <WebbyFeatureCard 
            icon={Target}
            title="Smart Matching"
            description="Webby learns what you need in plain English and finds roles that actually fit your life."
          />
          <WebbyFeatureCard 
            icon={Zap}
            title="One-Tap Interest"
            description="Express interest with AI-drafted messages. No more cover letter fatigue."
          />
        </div>
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white text-lg px-8"
            onClick={() => navigate('/webby-candidate')}
          >
            Activate Webby
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8"
            onClick={() => {
              const howItWorks = document.getElementById('how-it-works');
              howItWorks?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            See How It Works
          </Button>
        </div>
      </div>
    </section>
  );
};
