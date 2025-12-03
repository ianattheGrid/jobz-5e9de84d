import { useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const generateStars = (count: number, minSize: number, maxSize: number, minOpacity: number, maxOpacity: number): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: minSize + Math.random() * (maxSize - minSize),
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 3,
    opacity: minOpacity + Math.random() * (maxOpacity - minOpacity),
  }));
};

export const SpaceBackground = () => {
  // Generate three layers of stars for depth
  const farStars = useMemo(() => generateStars(60, 1, 1.5, 0.3, 0.5), []);
  const midStars = useMemo(() => generateStars(35, 1.5, 2.5, 0.5, 0.7), []);
  const nearStars = useMemo(() => generateStars(20, 2.5, 4, 0.7, 1), []);

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* Nebula color accents - very subtle */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 800px 600px at 15% 20%, hsla(330, 81%, 60%, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 600px 500px at 85% 75%, hsla(270, 70%, 60%, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 500px 400px at 60% 40%, hsla(190, 90%, 55%, 0.08) 0%, transparent 50%)
          `
        }}
      />

      {/* Far stars layer - tiny, dim, slow twinkle */}
      {farStars.map((star) => (
        <div
          key={`far-${star.id}`}
          className="absolute rounded-full bg-white animate-twinkle-far"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration + 2}s`,
          }}
        />
      ))}

      {/* Mid stars layer - medium size and brightness */}
      {midStars.map((star) => (
        <div
          key={`mid-${star.id}`}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Near stars layer - larger, brighter, with glow */}
      {nearStars.map((star) => (
        <div
          key={`near-${star.id}`}
          className="absolute rounded-full bg-white animate-twinkle-glow"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration - 0.5}s`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.5), 0 0 ${star.size * 4}px rgba(255, 255, 255, 0.2)`,
          }}
        />
      ))}

      {/* Shooting stars */}
      <div 
        className="absolute w-[2px] h-[2px] bg-white rounded-full animate-shooting-star-1"
        style={{
          top: '15%',
          right: '10%',
          boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.8), -40px 0 20px 1px rgba(255, 255, 255, 0.4)',
        }}
      />
      <div 
        className="absolute w-[2px] h-[2px] bg-white rounded-full animate-shooting-star-2"
        style={{
          top: '35%',
          right: '25%',
          boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.8), -40px 0 20px 1px rgba(255, 255, 255, 0.4)',
        }}
      />
      <div 
        className="absolute w-[1px] h-[1px] bg-white rounded-full animate-shooting-star-3"
        style={{
          top: '55%',
          right: '40%',
          boxShadow: '0 0 4px 1px rgba(255, 255, 255, 0.6), -30px 0 15px 1px rgba(255, 255, 255, 0.3)',
        }}
      />

      {/* Moon */}
      <div 
        className="absolute w-20 h-20 rounded-full"
        style={{
          top: '10%',
          left: '8%',
          background: `
            radial-gradient(circle at 35% 35%, 
              rgba(255, 255, 255, 0.95) 0%, 
              rgba(220, 220, 230, 0.9) 25%,
              rgba(180, 180, 195, 0.85) 50%, 
              rgba(140, 140, 160, 0.7) 75%,
              rgba(100, 100, 120, 0.5) 100%
            )
          `,
          boxShadow: `
            inset -8px -8px 20px rgba(0, 0, 0, 0.4),
            0 0 30px 8px rgba(255, 255, 255, 0.3), 
            0 0 60px 20px rgba(200, 200, 255, 0.15),
            0 0 100px 40px rgba(200, 200, 255, 0.08)
          `,
        }}
      />

      {/* Floating dust particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`dust-${i}`}
          className="absolute w-[1px] h-[1px] bg-white/30 rounded-full animate-float-dust"
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
};
