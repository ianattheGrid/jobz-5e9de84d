import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data - in a real app this would come from an API
const MOCK_CANDIDATES = [
  {
    id: 1,
    name: "John Doe",
    title: "Senior React Developer",
    location: "San Francisco, CA",
    experience: "8 years",
    skills: ["React", "TypeScript", "Node.js"],
    expectedSalary: "$120,000 - $150,000",
    availability: "Immediate",
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "UX Designer",
    location: "Remote",
    experience: "5 years",
    skills: ["Figma", "User Research", "UI Design"],
    expectedSalary: "$90,000 - $110,000",
    availability: "2 weeks",
  },
  {
    id: 3,
    name: "Mike Johnson",
    title: "Full Stack Engineer",
    location: "New York, NY",
    experience: "6 years",
    skills: ["Python", "React", "PostgreSQL"],
    expectedSalary: "$100,000 - $130,000",
    availability: "1 month",
  },
];

const CandidateSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  
  const filteredCandidates = MOCK_CANDIDATES.filter((candidate) => {
    const matchesSearch = Object.values(candidate).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const matchesExperience = experienceFilter === "all" || candidate.experience.includes(experienceFilter);
    const matchesLocation = locationFilter === "all" || candidate.location === locationFilter;
    
    return matchesSearch && matchesExperience && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">Find Candidates</h1>
          <a 
            href="/" 
            className="text-primary-DEFAULT hover:text-primary-dark transition-colors"
          >
            View Job Listings
          </a>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search candidates by name, skills, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/3">
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience Levels</SelectItem>
                  <SelectItem value="5 years">5+ Years</SelectItem>
                  <SelectItem value="8 years">8+ Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-1/3">
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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Expected Salary</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Skills</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.title}</TableCell>
                  <TableCell>{candidate.location}</TableCell>
                  <TableCell>{candidate.experience}</TableCell>
                  <TableCell>{candidate.expectedSalary}</TableCell>
                  <TableCell>{candidate.availability}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-xs rounded-full bg-primary-light text-primary-DEFAULT"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CandidateSearch;