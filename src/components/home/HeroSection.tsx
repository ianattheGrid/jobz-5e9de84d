import { Link } from "react-router-dom";
export const HeroSection = () => {
  return <section className="relative h-[500px] overflow-hidden">
      <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Abstract digital connections representing AI networking, ideal for explaining Connectors" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative container mx-auto px-4 h-full flex items-center pt-16 md:pt-0">
        <div className="max-w-2xl text-white">
          <h1 className="text-primary [&]:!text-primary text-4xl md:text-5xl font-bold mb-4">Welcome to the future of hiring. Prepare to do something you've never done before.</h1>
          <p className="text-xl mb-8">You control everything. We've combined automation, AI, recommendations, and hiring bonuses into one platform—then stepped out of your way.</p>
        </div>
      </div>
    </section>;
};