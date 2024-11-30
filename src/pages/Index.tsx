import { useState } from "react";
import JobCard from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

// Mock data - in a real app this would come from an API
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "Tech Corp",
    location: "San Francisco, CA",
    description: "We're looking for an experienced React developer to join our team and help build amazing products.",
    salary: "$120,000 - $150,000",
    type: "Full-time",
    candidateCommission: "$5,000 signing bonus",
    referralCommission: "$2,500 for successful referrals",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Design Studio",
    location: "Remote",
    description: "Join our creative team to design beautiful and functional user interfaces.",
    salary: "$90,000 - $110,000",
    type: "Contract",
    candidateCommission: "$3,000 signing bonus",
    referralCommission: "$1,500 for successful referrals",
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "Startup Inc",
    location: "New York, NY",
    description: "Help us build the next generation of web applications using modern technologies.",
    salary: "$100,000 - $130,000",
    type: "Full-time",
    candidateCommission: "$4,000 signing bonus",
    referralCommission: "$2,000 for successful referrals",
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentJobIndex, setCurrentJobIndex] = useState(0);

  const filteredJobs = MOCK_JOBS.filter((job) => {
    const matchesSearch = Object.values(job).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesLocation = locationFilter === "all" || job.location === locationFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      console.log("Applied to job:", filteredJobs[currentJobIndex].title);
    }
    setCurrentJobIndex((prev) => Math.min(prev + 1, filteredJobs.length - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
      <div className="container max-w-4xl mx-auto pt-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Find Your Perfect Job Match
          </h1>
          <a 
            href="/candidates" 
            className="text-primary-DEFAULT hover:text-primary-dark transition-colors"
          >
            For Employers
          </a>
        </div>

        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search jobs by title, company, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/2">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                  <SelectItem value="New York, NY">New York, NY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-1/2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="relative">
          {currentJobIndex < filteredJobs.length ? (
            <JobCard
              {...filteredJobs[currentJobIndex]}
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