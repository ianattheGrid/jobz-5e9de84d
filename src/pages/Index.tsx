import { useState } from "react";
import JobCard from "@/components/JobCard";

// Mock data - in a real app this would come from an API
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "Tech Corp",
    location: "San Francisco, CA",
    description: "We're looking for an experienced React developer to join our team and help build amazing products.",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Design Studio",
    location: "Remote",
    description: "Join our creative team to design beautiful and functional user interfaces.",
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "Startup Inc",
    location: "New York, NY",
    description: "Help us build the next generation of web applications using modern technologies.",
  },
];

const Index = () => {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      // In a real app, this would call an API to record the match
      console.log("Liked job:", MOCK_JOBS[currentJobIndex].title);
    }
    setCurrentJobIndex((prev) => Math.min(prev + 1, MOCK_JOBS.length - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
      <div className="container max-w-4xl mx-auto pt-12 px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Find Your Perfect Job Match
        </h1>
        <div className="relative">
          {currentJobIndex < MOCK_JOBS.length ? (
            <JobCard
              {...MOCK_JOBS[currentJobIndex]}
              onSwipe={handleSwipe}
            />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700">
                No more jobs to show!
              </h2>
              <p className="text-gray-600 mt-2">
                Check back later for new opportunities
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;