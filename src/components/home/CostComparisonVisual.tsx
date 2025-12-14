import { motion } from "framer-motion";
import { User, Lock, Sparkles } from "lucide-react";

const CostComparisonVisual = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* CSS Keyframes for pulsing glow */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
          50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.5); }
        }
        @keyframes pulseBadgeGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.4); }
          50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.6); }
        }
        .avatar-glow { animation: pulseGlow 2s ease-in-out infinite; }
        .badge-glow { animation: pulseBadgeGlow 2s ease-in-out infinite; }
      `}</style>

      {/* Background with subtle stars */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              type: "tween",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16"
        >
          <span className="text-foreground">You're an SME. </span>
          <span className="bg-gradient-to-r from-primary via-pink-400 to-primary bg-clip-text text-transparent">
            Who would you hire?
          </span>
        </motion.h2>

        {/* Cards Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-5xl mx-auto">
          
          {/* Traditional Card - £10K */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group w-full max-w-sm"
          >
            {/* Card */}
            <div className="relative bg-black/60 border border-white/10 rounded-2xl p-8 overflow-hidden">
              {/* Chain-link overlay effect */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 20px,
                    rgba(255,255,255,0.03) 20px,
                    rgba(255,255,255,0.03) 21px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 20px,
                    rgba(255,255,255,0.03) 20px,
                    rgba(255,255,255,0.03) 21px
                  )`
                }}
              />
              
              {/* Oppressive dark gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-black/40" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Avatar with lock */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-800/80 border-2 border-gray-600/50 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-500" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    className="absolute -bottom-2 -right-2 bg-gray-700 rounded-full p-2"
                  >
                    <Lock className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </div>

                {/* Profile lines (greyed out) */}
                <div className="w-full space-y-3 mb-6">
                  <div className="h-4 bg-gray-700/50 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-gray-700/30 rounded w-1/2 mx-auto" />
                  <div className="h-3 bg-gray-700/30 rounded w-2/3 mx-auto" />
                </div>

                {/* Label */}
                <span className="text-gray-500 text-sm uppercase tracking-wider mb-4">Traditional</span>

                {/* Price Tag */}
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  whileInView={{ scale: 1, rotate: -3 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-2xl md:text-3xl px-6 py-3 rounded-lg shadow-lg shadow-red-900/30"
                >
                  £10,000
                </motion.div>
              </div>

              {/* Subtle shake animation on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ x: [0, -1, 1, -1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3, type: "tween" }}
              />
            </div>
          </motion.div>

          {/* VS Divider */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-2xl font-bold text-muted-foreground/50 hidden lg:block"
          >
            vs
          </motion.div>

          {/* Jobz Card - £9 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative group w-full max-w-sm"
          >
            {/* Glow effect behind card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-pink-500/20 to-primary/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            
            {/* Card */}
            <div className="relative bg-black/40 backdrop-blur-sm border border-primary/30 rounded-2xl p-8 overflow-hidden">
              {/* Warm gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-pink-500/5" />

              {/* Floating particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/60 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    bottom: "0%",
                  }}
                  animate={{
                    y: [0, -100 - Math.random() * 50],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    type: "tween",
                  }}
                />
              ))}

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Avatar with sparkle - using CSS animation for glow */}
                <div className="relative mb-6">
                  <div className="avatar-glow w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-pink-500/20 border-2 border-primary/50 flex items-center justify-center">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-pink-500 rounded-full p-2"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                </div>

                {/* Profile lines (vibrant) */}
                <div className="w-full space-y-3 mb-6">
                  <div className="h-4 bg-gradient-to-r from-primary/40 to-pink-500/40 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-primary/25 rounded w-1/2 mx-auto" />
                  <div className="h-3 bg-pink-500/25 rounded w-2/3 mx-auto" />
                </div>

                {/* Label */}
                <span className="bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent text-sm uppercase tracking-wider font-semibold mb-4">
                  Jobz
                </span>

                {/* Price Tag - using CSS animation for glow */}
                <motion.div
                  initial={{ scale: 0, rotate: 10 }}
                  whileInView={{ scale: 1, rotate: 3 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                  className="badge-glow bg-gradient-to-r from-primary to-pink-500 text-white font-bold text-2xl md:text-3xl px-6 py-3 rounded-lg cursor-pointer"
                >
                  £9
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CostComparisonVisual;
