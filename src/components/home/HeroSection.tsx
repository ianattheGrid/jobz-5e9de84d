import { Link } from "react-router-dom";
export const HeroSection = () => {
  return <section className="relative h-[500px] overflow-hidden">
      <img src="/lovable-uploads/7be09af5-7186-41b7-867e-8354c980e8a5.png" alt="Astronaut in futuristic desert landscape representing exploration of new hiring frontiers" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative container mx-auto px-4 h-full flex items-center pt-16 md:pt-0">
        <div className="max-w-2xl text-white">
          <h1 className="text-primary [&]:!text-primary text-4xl md:text-5xl font-bold mb-4">Welcome to what's next. This is how you'll do hiring from now on.</h1>
          <p className="text-xl mb-8">You control everything. We've combined automation, AI, recommendations, and hiring bonuses into one platform—then stepped out of your way.</p>
        </div>
      </div>
    </section>;
};