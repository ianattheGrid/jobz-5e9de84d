import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative h-[500px] overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
        alt="Abstract digital connections representing AI networking"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI Makes Hiring Fast, Affordable, and Effortless.
          </h1>
          <p className="text-xl mb-8">
            Save thousands of pounds and hours with your virtual hiring team—no middlemen, just smarter hiring
          </p>
          <div className="flex gap-4">
            <Link 
              to="/employer/signup"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium"
            >
              Start Hiring
            </Link>
            <Link 
              to="/candidate/signup"
              className="bg-white hover:bg-gray-100 text-primary px-6 py-3 rounded-lg font-medium"
            >
              Find Jobs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};