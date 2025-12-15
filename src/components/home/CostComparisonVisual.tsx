import { motion } from "framer-motion";
import astronautImage from "@/assets/astronaut-candidate.jpg";

const CostComparisonVisual = () => {
  return (
    <section className="relative w-screen -mx-[calc((100vw-100%)/2)] overflow-hidden">
      {/* Full-width container with two images side by side */}
      <div className="flex flex-col md:flex-row w-full h-[50vh] md:h-[60vh]">
        {/* Left Image */}
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
        </motion.div>

        {/* Right Image */}
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
        </motion.div>
      </div>

      {/* Prices below images */}
      <div className="flex flex-col md:flex-row w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full md:w-1/2 py-4 text-center"
        >
          <span className="text-foreground text-sm md:text-base font-semibold tracking-wide">
            £10,000
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full md:w-1/2 py-4 text-center"
        >
          <span className="text-foreground text-sm md:text-base font-semibold tracking-wide">
            £9
          </span>
        </motion.div>
      </div>

      {/* Question below */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center text-foreground text-sm md:text-base font-medium py-4"
      >
        You're an SME, who would you hire?
      </motion.p>
    </section>
  );
};

export default CostComparisonVisual;
