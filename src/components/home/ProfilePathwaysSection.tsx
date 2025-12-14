import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";
import { motion } from "framer-motion";
import { Rocket, TrendingUp, Target, Compass, Star, LucideIcon } from "lucide-react";
import { useState } from "react";

const pathways = [
  { 
    name: "The Launchpad", 
    description: "Your first role – where potential meets opportunity",
    icon: Rocket,
    position: { x: 10, y: 55 },
    tooltipPosition: 'below' as const
  },
  { 
    name: "The Ascent", 
    description: "Early career growth – building your foundation",
    icon: TrendingUp,
    position: { x: 30, y: 30 },
    tooltipPosition: 'above' as const
  },
  { 
    name: "The Core", 
    description: "Professional mastery – at the peak of your expertise",
    icon: Target,
    position: { x: 50, y: 55 },
    tooltipPosition: 'below' as const
  },
  { 
    name: "The Pivot", 
    description: "New direction – your skills translate everywhere",
    icon: Compass,
    position: { x: 70, y: 30 },
    tooltipPosition: 'above' as const
  },
  { 
    name: "The Encore", 
    description: "Your next chapter – wisdom meets new purpose",
    icon: Star,
    position: { x: 90, y: 55 },
    tooltipPosition: 'below' as const
  },
];

// Desktop node with intelligent tooltip positioning
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
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        style={{ 
          width: isHovered ? 140 : 100, 
          height: isHovered ? 140 : 100,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2
        }}
      />
      
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/30"
        style={{ 
          width: isHovered ? 110 : 80, 
          height: isHovered ? 110 : 80,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.15
        }}
      />

      {/* Main node */}
      <motion.div
        className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary/80 to-pink-600"
        style={{
          width: 64,
          height: 64,
          boxShadow: isHovered 
            ? '0 0 60px rgba(236, 72, 153, 0.8), 0 0 100px rgba(236, 72, 153, 0.4), inset 0 0 20px rgba(255,255,255,0.2)'
            : '0 0 30px rgba(236, 72, 153, 0.5), 0 0 60px rgba(236, 72, 153, 0.2), inset 0 0 15px rgba(255,255,255,0.1)'
        }}
        animate={{
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="w-7 h-7 text-white drop-shadow-lg" strokeWidth={2} />
      </motion.div>

      {/* Label - positioned based on node position */}
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
          className={`font-bold text-lg ${PRIMARY_COLOR_PATTERN}`}
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
        {/* Glowing node */}
        <motion.div
          className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary/80 to-pink-600 z-10"
          style={{
            width: 56,
            height: 56,
            minWidth: 56,
            boxShadow: '0 0 30px rgba(236, 72, 153, 0.5), 0 0 60px rgba(236, 72, 153, 0.2), inset 0 0 15px rgba(255,255,255,0.1)'
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 60px rgba(236, 72, 153, 0.8), 0 0 100px rgba(236, 72, 153, 0.4), inset 0 0 20px rgba(255,255,255,0.2)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
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
          <Icon className="w-6 h-6 text-white drop-shadow-lg relative z-10" strokeWidth={2} />
        </motion.div>
        
        {/* Connecting line to next node */}
        {!isLast && (
          <motion.div
            className="w-0.5 h-16 bg-gradient-to-b from-primary/60 via-primary/30 to-primary/60"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
            style={{ originY: 0 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="pt-2 pb-8">
        <h4 className={`font-bold text-lg ${PRIMARY_COLOR_PATTERN}`}>
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
  // Calculate control point for curved line
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - 15;
  
  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`lineGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      
      {/* Main connection line */}
      <motion.path
        d={`M ${from.x}% ${from.y}% Q ${midX}% ${midY}% ${to.x}% ${to.y}%`}
        fill="none"
        stroke={`url(#lineGradient-${index})`}
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ 
          delay: 0.5 + index * 0.2,
          duration: 1,
          ease: "easeOut"
        }}
      />
      
      {/* Animated particle along path */}
      <motion.circle
        r="3"
        fill="hsl(var(--primary))"
        filter="url(#glow)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5 + index * 0.2 }}
      >
        <animateMotion
          dur={`${3 + index * 0.5}s`}
          repeatCount="indefinite"
          path={`M ${from.x * 6} ${from.y * 3} Q ${midX * 6} ${midY * 3} ${to.x * 6} ${to.y * 3}`}
        />
      </motion.circle>

      {/* Glow filter */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </motion.svg>
  );
};

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
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
      {/* Space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        {/* Nebula effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <FloatingParticles />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
          {/* Headline */}
          <motion.h2 
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight ${PRIMARY_COLOR_PATTERN}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Your career isn't one-size-fits-all.
            <br />
            Your profile shouldn't be either.
          </motion.h2>

          {/* Body Copy */}
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
          {/* Connection lines */}
          {pathways.slice(0, -1).map((pathway, i) => (
            <ConnectionLine
              key={i}
              from={pathway.position}
              to={pathways[i + 1].position}
              index={i}
            />
          ))}

          {/* Pathway nodes */}
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

        {/* Closing Line */}
        <motion.p 
          className="text-xl md:text-2xl font-semibold text-foreground text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Tell your authentic story. Find your perfect fit.
        </motion.p>
      </div>
    </section>
  );
};
