import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import JobCard from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Job = Database['public']['Tables']['jobs']['Row'];

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const { toast } = useToast();

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Job[];
    }
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load jobs. Please try again later.",
    });
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "all" || job.location === locationFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      toast({
        title: "Application Submitted",
        description: `You've applied to ${filteredJobs[currentJobIndex].title} at ${filteredJobs[currentJobIndex].company}`,
      });
    }
    setCurrentJobIndex((prev) => Math.min(prev + 1, filteredJobs.length - 1));
  };

  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location)));
  const uniqueTypes = Array.from(new Set(jobs.map(job => job.type)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
      <div className="container max-w-4xl mx-auto pt-12 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Available Positions
        </h1>

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
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
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
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading jobs...</p>
            </div>
          ) : filteredJobs.length > 0 && currentJobIndex < filteredJobs.length ? (
            <JobCard
              {...filteredJobs[currentJobIndex]}
              salary={`£${filteredJobs[currentJobIndex].salary_min.toLocaleString()} - £${filteredJobs[currentJobIndex].salary_max.toLocaleString()}`}
              onSwipe={handleSwipe}
            />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700">
                No jobs found
              </h2>
              <p className="text-gray-600 mt-2">
                Try adjusting your filters or check back later for new opportunities
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;