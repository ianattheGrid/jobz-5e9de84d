import { motion } from "framer-motion";
import astronautImage from "@/assets/astronaut-candidate.jpg";

const CostComparisonVisual = () => {
  return (
    <section className="relative w-screen -mx-[calc((100vw-100%)/2)] overflow-hidden">
      {/* Full-width container with two images side by side */}
      <div className="flex flex-col md:flex-row w-full h-[60vh] md:h-[70vh]">
        {/* Left Image - £10,000 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full md:w-1/2 h-1/2 md:h-full"
        >
          <img
            src={astronautImage}
            alt="Candidate"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <span className="text-white/90 text-sm md:text-base font-light tracking-wide">
              £10,000
            </span>
          </motion.div>
        </motion.div>

        {/* Right Image - £9 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full md:w-1/2 h-1/2 md:h-full"
        >
          <img
            src={astronautImage}
            alt="Candidate"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <span className="text-white/90 text-sm md:text-base font-light tracking-wide">
              £9
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Question below */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center text-muted-foreground text-sm md:text-base font-light italic py-8"
      >
        You're an SME, who would you hire?
      </motion.p>
    </section>
  );
};

export default CostComparisonVisual;
