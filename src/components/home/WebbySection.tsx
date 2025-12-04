import { Target, Users, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { WebbyDemoDialog } from "./WebbyDemoDialog";

interface WebbyFeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const WebbyFeatureCard = ({ icon: Icon, title, description }: WebbyFeatureCardProps) => (
  <div className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-primary/20 hover:border-primary/40 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-fade-in">
    <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="relative">
      <div className="w-14 h-14 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-primary/30">
        <Icon className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export const WebbySection = () => {
  const navigate = useNavigate();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <section className="relative min-h-[600px] overflow-hidden bg-gradient-to-br from-[#1a0a15] via-[#2d1028] to-[#150a1a]">
      {/* Pink nebula glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/30 rounded-full blur-[120px]"
        />
        <div 
          className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"
        />
        <div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-[#ff1493]/20 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: '1s' }}
        />
        <div 
          className="absolute top-40 left-40 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl"
        />
      </div>
      
      {/* Animated pink stars/particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-primary rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative container mx-auto px-4 py-20">
        {/* Central Webby "orb" with enhanced glow animation */}
        <div className="flex justify-center mb-12 animate-fade-in">
          <div className="relative">
            {/* Multiple layered glow rings */}
            <div className="absolute inset-0 w-40 h-40 -m-8 rounded-full bg-primary/40 blur-[80px] animate-pulse-glow" />
            <div className="absolute inset-0 w-36 h-36 -m-6 rounded-full bg-primary/30 blur-3xl animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
            
            {/* Main glowing orb - larger and more prominent */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary via-[#ff1493] to-[#ff69b4] shadow-[0_0_80px_rgba(236,72,153,0.8)] animate-pulse-glow flex items-center justify-center">
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl" />
              {/* Sparkle icon overlay */}
              <Sparkles className="relative text-white w-16 h-16 animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
            
            {/* Rotating orbital particles with trails */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute w-3 h-3 bg-primary rounded-full shadow-[0_0_20px_rgba(236,72,153,0.8)]"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 45}deg) translateY(-65px)`,
                  animation: `float 4s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                  opacity: 0.9,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Headlines */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-4xl md:text-6xl font-bold text-center text-white mb-4">
            Meet <span className="text-primary drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">Webby</span>. Where potential meets opportunity.
          </h2>
          <p className="text-xl md:text-2xl text-center text-white/80 max-w-3xl mx-auto mb-16 leading-relaxed">
            Job boards match your past. Webby matches your potential. For candidates ready to grow, and employers ready to develop talent—not just find it.
          </p>
        </div>
        
        {/* Three pillars - floating cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          <WebbyFeatureCard 
            icon={Target}
            title="Where You're Going"
            description="Tell Webby what excites you next—not just what you've done. Your future matters more than your history."
          />
          <WebbyFeatureCard 
            icon={Users}
            title="Skills, Not Clones"
            description="Employers: find the missing piece, not another copy. Someone different who you can develop into your next star."
          />
          <WebbyFeatureCard 
            icon={MessageCircle}
            title="Real Conversations"
            description="No cover letters. No keyword games. Just honest conversations between people ready to grow together."
          />
        </div>
        
        {/* CTA buttons */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white text-lg px-8 shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_40px_rgba(236,72,153,0.6)] transition-all"
            onClick={() => setIsDemoOpen(true)}
          >
            Watch Webby Work
          </Button>
        </div>
      </div>
      
      <WebbyDemoDialog open={isDemoOpen} onOpenChange={setIsDemoOpen} />
    </section>
  );
};
