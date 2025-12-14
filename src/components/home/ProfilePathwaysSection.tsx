import { motion } from "framer-motion";
import { Rocket, TrendingUp, Target, Compass, Star, LucideIcon } from "lucide-react";
import { useState } from "react";

// Planet styles for each pathway
const planetStyles = {
  launchpad: {
    gradient: "from-cyan-600 via-teal-500 to-emerald-600",
    glow: "rgba(20, 184, 166, 0.6)",
    glowIntense: "rgba(20, 184, 166, 0.9)",
    ring: false,
    size: 56,
  },
  ascent: {
    gradient: "from-blue-600 via-indigo-500 to-purple-600",
    glow: "rgba(99, 102, 241, 0.6)",
    glowIntense: "rgba(99, 102, 241, 0.9)",
    ring: false,
    size: 60,
  },
  core: {
    gradient: "from-amber-500 via-yellow-500 to-orange-500",
    glow: "rgba(245, 158, 11, 0.6)",
    glowIntense: "rgba(245, 158, 11, 0.9)",
    ring: true,
    size: 68,
  },
  pivot: {
    gradient: "from-orange-500 via-rose-500 to-blue-500",
    glow: "rgba(244, 63, 94, 0.6)",
    glowIntense: "rgba(244, 63, 94, 0.9)",
    ring: false,
    size: 60,
  },
  encore: {
    gradient: "from-yellow-400 via-amber-300 to-white",
    glow: "rgba(251, 191, 36, 0.7)",
    glowIntense: "rgba(251, 191, 36, 1)",
    ring: false,
    size: 64,
    isStar: true,
  },
};

const pathways = [
  { 
    name: "The Launchpad", 
    description: "Your first role – where potential meets opportunity",
    icon: Rocket,
    position: { x: 10, y: 55 },
    tooltipPosition: 'below' as const,
    planet: planetStyles.launchpad,
    color: "text-teal-400"
  },
  { 
    name: "The Ascent", 
    description: "Early career growth – building your foundation",
    icon: TrendingUp,
    position: { x: 30, y: 30 },
    tooltipPosition: 'above' as const,
    planet: planetStyles.ascent,
    color: "text-indigo-400"
  },
  { 
    name: "The Core", 
    description: "Professional mastery – at the peak of your expertise",
    icon: Target,
    position: { x: 50, y: 55 },
    tooltipPosition: 'below' as const,
    planet: planetStyles.core,
    color: "text-amber-400"
  },
  { 
    name: "The Pivot", 
    description: "New direction – your skills translate everywhere",
    icon: Compass,
    position: { x: 70, y: 30 },
    tooltipPosition: 'above' as const,
    planet: planetStyles.pivot,
    color: "text-rose-400"
  },
  { 
    name: "The Encore", 
    description: "Your next chapter – wisdom meets new purpose",
    icon: Star,
    position: { x: 90, y: 55 },
    tooltipPosition: 'below' as const,
    planet: planetStyles.encore,
    color: "text-yellow-300"
  },
];

// Desktop node with unique planet designs
const PathwayNode = ({ 
  pathway, 
  index, 
  isHovered, 
  onHover 
}: { 
  pathway: typeof pathways[0]; 
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}) => {
  const Icon = pathway.icon;
  const isTooltipAbove = pathway.tooltipPosition === 'above';
  const { planet } = pathway;
  
  return (
    <motion.div
      className="absolute cursor-pointer z-10"
      style={{ 
        left: `${pathway.position.x}%`, 
        top: `${pathway.position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 50 : 10
      }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        delay: index * 0.15,
        duration: 0.6,
        type: "spring",
        stiffness: 200
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Outer atmospheric glow */}
      <motion.div
        className="absolute rounded-full"
        style={{ 
          width: isHovered ? planet.size * 2.2 : planet.size * 1.6, 
          height: isHovered ? planet.size * 2.2 : planet.size * 1.6,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${planet.glow} 0%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2
        }}
      />
      
      {/* Inner glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ 
          width: isHovered ? planet.size * 1.5 : planet.size * 1.25, 
          height: isHovered ? planet.size * 1.5 : planet.size * 1.25,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${planet.glow} 0%, transparent 60%)`
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.15
        }}
      />

      {/* Saturn-like ring for Core pathway */}
      {planet.ring && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: planet.size * 2,
            height: planet.size * 0.5,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotateX(70deg)',
            border: '3px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)'
          }}
          animate={{
            rotateZ: [0, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}

      {/* Star rays for Encore */}
      {(planet as any).isStar && (
        <>
          {[0, 45, 90, 135].map((rotation) => (
            <motion.div
              key={rotation}
              className="absolute"
              style={{
                width: 2,
                height: planet.size * 1.8,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(251, 191, 36, 0.6) 30%, rgba(251, 191, 36, 0.6) 70%, transparent 100%)'
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scaleY: [0.9, 1.1, 0.9]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: rotation * 0.05
              }}
            />
          ))}
        </>
      )}

      {/* Main planet body */}
      <motion.div
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${planet.gradient}`}
        style={{
          width: planet.size,
          height: planet.size,
          boxShadow: isHovered 
            ? `0 0 40px ${planet.glowIntense}, 0 0 80px ${planet.glow}, inset 0 0 20px rgba(255,255,255,0.3)`
            : `0 0 20px ${planet.glow}, 0 0 40px ${planet.glow.replace('0.6', '0.3')}, inset 0 0 15px rgba(255,255,255,0.2)`
        }}
        animate={{
          scale: isHovered ? 1.15 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Surface texture overlay */}
        <div 
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)'
          }}
        />
        <Icon className="w-7 h-7 text-white drop-shadow-lg relative z-10" strokeWidth={2} />
      </motion.div>

      {/* Label */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
        style={{ 
          [isTooltipAbove ? 'bottom' : 'top']: isHovered ? 90 : 80,
        }}
        animate={{
          y: isHovered ? (isTooltipAbove ? -5 : 5) : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.p 
          className={`font-bold text-lg ${pathway.color}`}
          animate={{ scale: isHovered ? 1.1 : 1 }}
        >
          {pathway.name}
        </motion.p>
        <motion.p 
          className="text-sm text-muted-foreground max-w-[200px] mt-1"
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            height: isHovered ? 'auto' : 0
          }}
          transition={{ duration: 0.2 }}
        >
          {pathway.description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// Mobile/Tablet vertical timeline node
const MobilePathwayNode = ({ 
  pathway, 
  index,
  isLast
}: { 
  pathway: typeof pathways[0]; 
  index: number;
  isLast: boolean;
}) => {
  const Icon = pathway.icon;
  const { planet } = pathway;
  
  return (
    <motion.div
      className="relative flex items-start gap-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.5,
      }}
    >
      {/* Node with connecting line */}
      <div className="relative flex flex-col items-center">
        {/* Glowing planet node */}
        <motion.div
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${planet.gradient} z-10`}
          style={{
            width: 52,
            height: 52,
            minWidth: 52,
            boxShadow: `0 0 20px ${planet.glow}, 0 0 40px ${planet.glow.replace('0.6', '0.3')}, inset 0 0 15px rgba(255,255,255,0.2)`
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: `0 0 40px ${planet.glowIntense}, 0 0 80px ${planet.glow}`
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${planet.glow} 0%, transparent 70%)`
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          />
          {/* Surface highlight */}
          <div 
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)'
            }}
          />
          <Icon className="w-5 h-5 text-white drop-shadow-lg relative z-10" strokeWidth={2} />
        </motion.div>
        
        {/* Connecting line to next node */}
        {!isLast && (
          <motion.div
            className="w-0.5 h-16"
            style={{
              background: 'linear-gradient(to bottom, rgba(148, 163, 184, 0.4), rgba(148, 163, 184, 0.2))'
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="pt-2 pb-8">
        <h4 className={`font-bold text-lg ${pathway.color}`}>
          {pathway.name}
        </h4>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          {pathway.description}
        </p>
      </div>
    </motion.div>
  );
};

const ConnectionLine = ({ 
  from, 
  to, 
  index 
}: { 
  from: { x: number; y: number }; 
  to: { x: number; y: number };
  index: number;
}) => {
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - 15;
  
  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`lineGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(148, 163, 184)" stopOpacity="0.15" />
          <stop offset="50%" stopColor="rgb(148, 163, 184)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="rgb(148, 163, 184)" stopOpacity="0.15" />
        </linearGradient>
        <filter id={`starGlow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Constellation line */}
      <motion.path
        d={`M ${from.x}% ${from.y}% Q ${midX}% ${midY}% ${to.x}% ${to.y}%`}
        fill="none"
        stroke={`url(#lineGradient-${index})`}
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ 
          delay: 0.5 + index * 0.2,
          duration: 1,
          ease: "easeOut"
        }}
      />
      
      {/* Traveling star particle */}
      <motion.circle
        r="2"
        fill="rgb(226, 232, 240)"
        filter={`url(#starGlow-${index})`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5 + index * 0.2 }}
      >
        <animateMotion
          dur={`${4 + index * 0.5}s`}
          repeatCount="indefinite"
          path={`M ${from.x * 6} ${from.y * 3} Q ${midX * 6} ${midY * 3} ${to.x * 6} ${to.y * 3}`}
        />
      </motion.circle>
    </motion.svg>
  );
};

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-slate-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export const ProfilePathwaysSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Space background with nebula effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/3 rounded-full blur-3xl" />
      </div>

      <FloatingParticles />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight bg-gradient-to-r from-teal-400 via-indigo-400 to-amber-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Your career isn't one-size-fits-all.
            <br />
            Your profile shouldn't be either.
          </motion.h2>

          <motion.div 
            className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p>
              Generic job profiles often miss the mark, failing to capture the nuances of your professional journey. 
              They don't understand the drive of a first-timer, the transferable skills of a career changer, or the 
              invaluable wisdom of a seasoned professional. They force everyone into the same mould, leaving valuable 
              stories untold.
            </p>
            
            <p className="text-foreground font-semibold text-xl md:text-2xl">
              At Jobz, we see you.
            </p>
            
            <p>
              We've reimagined the candidate profile, creating five tailored pathways designed to highlight your 
              unique strengths at every stage.
            </p>
          </motion.div>
        </div>

        {/* Desktop Constellation visualization */}
        <div className="hidden lg:block relative h-[450px] max-w-5xl mx-auto mb-16">
          {pathways.slice(0, -1).map((pathway, i) => (
            <ConnectionLine
              key={i}
              from={pathway.position}
              to={pathways[i + 1].position}
              index={i}
            />
          ))}

          {pathways.map((pathway, index) => (
            <PathwayNode
              key={pathway.name}
              pathway={pathway}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={setHoveredIndex}
            />
          ))}
        </div>

        {/* Mobile/Tablet Vertical Timeline */}
        <div className="lg:hidden flex justify-center mb-12">
          <div className="flex flex-col">
            {pathways.map((pathway, index) => (
              <MobilePathwayNode
                key={pathway.name}
                pathway={pathway}
                index={index}
                isLast={index === pathways.length - 1}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
