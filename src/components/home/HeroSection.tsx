
import { Link } from "react-router-dom";
export const HeroSection = () => {
  return <section className="relative h-[500px] overflow-hidden">
      <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Abstract digital connections representing AI networking" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative container mx-auto px-4 h-full flex items-center pt-16 md:pt-0">
        <div className="max-w-2xl text-white">
          <h1 className="text-primary [&]:!text-primary text-4xl md:text-5xl font-bold mb-4">Your recruitment agency in your pocket...</h1>
          <p className="text-xl mb-8">AI changes the game for SMEs. Save thousands per hire. Recruit in a click. Empower anyone to earn. Attract top talent with our "You're hired bonus".</p>
        </div>
      </div>
    </section>;
};
