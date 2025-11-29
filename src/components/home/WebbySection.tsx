import { Shield, Target, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface WebbyFeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const WebbyFeatureCard = ({ icon: Icon, title, description }: WebbyFeatureCardProps) => (
  <div className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300 hover:bg-white/10 animate-fade-in">
    <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="relative">
      <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export const WebbySection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[600px] overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#1a1047] to-[#0d1b2a]">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large stars with glow */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`large-${i}`}
            className="absolute w-3 h-3 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: '0 0 20px 2px rgba(255, 255, 255, 0.8)',
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
        
        {/* Medium stars */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`medium-${i}`}
            className="absolute w-2 h-2 bg-white/80 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        
        {/* Small floating stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`small-${i}`}
            className="absolute w-1 h-1 bg-white/60 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        
        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Nebula glow effects */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle 600px at 50% 50%, hsl(var(--primary) / 0.4) 0%, transparent 50%)`
        }}
      />
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle 400px at 30% 70%, hsl(var(--brand-purple) / 0.3) 0%, transparent 50%)`
        }}
      />
      
      {/* Main content */}
      <div className="relative container mx-auto px-4 py-20">
        {/* Central Webby "orb" with glow animation */}
        <div className="flex justify-center mb-12 animate-fade-in">
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 w-32 h-32 -m-4 rounded-full bg-primary/20 blur-2xl animate-pulse-glow" />
            
            {/* Main glowing orb */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary via-[hsl(var(--brand-purple))] to-[hsl(var(--brand-blue))] animate-pulse-glow flex items-center justify-center">
              {/* Sparkle icon overlay */}
              <Sparkles className="text-white w-12 h-12 animate-pulse" />
            </div>
            
            {/* Orbital particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 60}deg) translateY(-50px)`,
                  animation: `float 3s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Headlines */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-4xl md:text-6xl font-bold text-center text-white mb-4">
            Meet <span className="text-primary">Webby</span>. Your AI Navigator.
          </h2>
          <p className="text-xl md:text-2xl text-center text-white/80 max-w-3xl mx-auto mb-16 leading-relaxed">
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
            className="text-white border-white/30 hover:bg-white/10 bg-white/5 backdrop-blur-sm text-lg px-8"
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
