import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Node {
  id: string;
  x: number;
  y: number;
  type: "employer" | "connector" | "candidate";
  size: number;
}

interface Connection {
  from: string;
  to: string;
}

const nodes: Node[] = [
  // Employers (upper area - pink)
  { id: "e1", x: 15, y: 20, type: "employer", size: 12 },
  { id: "e2", x: 45, y: 15, type: "employer", size: 10 },
  { id: "e3", x: 80, y: 25, type: "employer", size: 14 },
  
  // Connectors (middle - cyan/teal)
  { id: "c1", x: 25, y: 50, type: "connector", size: 10 },
  { id: "c2", x: 55, y: 45, type: "connector", size: 12 },
  { id: "c3", x: 75, y: 55, type: "connector", size: 10 },
  
  // Candidates (lower area - purple)
  { id: "p1", x: 10, y: 80, type: "candidate", size: 11 },
  { id: "p2", x: 35, y: 75, type: "candidate", size: 13 },
  { id: "p3", x: 60, y: 85, type: "candidate", size: 10 },
  { id: "p4", x: 90, y: 78, type: "candidate", size: 12 },
];

const connections: Connection[] = [
  // Employers to Connectors
  { from: "e1", to: "c1" },
  { from: "e2", to: "c2" },
  { from: "e3", to: "c3" },
  { from: "e2", to: "c1" },
  { from: "e3", to: "c2" },
  
  // Connectors to Candidates
  { from: "c1", to: "p1" },
  { from: "c1", to: "p2" },
  { from: "c2", to: "p2" },
  { from: "c2", to: "p3" },
  { from: "c3", to: "p3" },
  { from: "c3", to: "p4" },
  
  // Cross connections for network effect
  { from: "c1", to: "c2" },
  { from: "c2", to: "c3" },
];

const getNodeColor = (type: Node["type"]) => {
  switch (type) {
    case "employer":
      return {
        fill: "hsl(330, 80%, 60%)", // Pink
        glow: "rgba(236, 72, 153, 0.6)",
      };
    case "connector":
      return {
        fill: "hsl(180, 70%, 50%)", // Cyan/Teal
        glow: "rgba(34, 211, 238, 0.6)",
      };
    case "candidate":
      return {
        fill: "hsl(270, 70%, 60%)", // Purple
        glow: "rgba(168, 85, 247, 0.6)",
      };
  }
};

export const ConstellationBackground = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getNodeById = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* SVG for connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          {/* Gradient for lines */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0.5)" />
            <stop offset="50%" stopColor="rgba(34, 211, 238, 0.5)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.5)" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {connections.map((conn, index) => {
          const fromNode = getNodeById(conn.from);
          const toNode = getNodeById(conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`${conn.from}-${conn.to}`}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isVisible ? { pathLength: 1, opacity: 0.6 } : {}}
              transition={{
                duration: 1.5,
                delay: 0.5 + index * 0.1,
                ease: "easeOut",
              }}
            />
          );
        })}

        {/* Animated pulse particles along lines */}
        {connections.map((conn, index) => {
          const fromNode = getNodeById(conn.from);
          const toNode = getNodeById(conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.circle
              key={`pulse-${conn.from}-${conn.to}`}
              r="2"
              fill="white"
              opacity="0.8"
              filter="url(#glow)"
              initial={{ opacity: 0 }}
              animate={
                isVisible
                  ? {
                      cx: [`${fromNode.x}%`, `${toNode.x}%`],
                      cy: [`${fromNode.y}%`, `${toNode.y}%`],
                      opacity: [0, 0.8, 0.8, 0],
                    }
                  : {}
              }
              transition={{
                duration: 3,
                delay: 2 + (index % 5) * 0.6,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "linear",
              }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, index) => {
        const colors = getNodeColor(node.type);
        return (
          <motion.div
            key={node.id}
            className="absolute rounded-full"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: node.size,
              height: node.size,
              backgroundColor: colors.fill,
              boxShadow: `0 0 ${node.size * 2}px ${colors.glow}, 0 0 ${node.size * 4}px ${colors.glow}`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={isVisible ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
              type: "spring",
              stiffness: 200,
            }}
          >
            {/* Inner glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "white", opacity: 0.3 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{
                duration: 2 + index * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        );
      })}

      {/* Subtle floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
};
