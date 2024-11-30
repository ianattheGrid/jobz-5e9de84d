import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search } from "lucide-react";

// Mock data - in a real app this would come from an API
const MOCK_CANDIDATES = [
  {
    id: 1,
    name: "John Doe",
    title: "Senior React Developer",
    location: "San Francisco, CA",
    experience: "8 years",
    skills: ["React", "TypeScript", "Node.js"],
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "UX Designer",
    location: "Remote",
    experience: "5 years",
    skills: ["Figma", "User Research", "UI Design"],
  },
  {
    id: 3,
    name: "Mike Johnson",
    title: "Full Stack Engineer",
    location: "New York, NY",
    experience: "6 years",
    skills: ["Python", "React", "AWS"],
  },
];

const CandidateSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCandidates = MOCK_CANDIDATES.filter((candidate) =>
    Object.values(candidate).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">Find Candidates</h1>
        
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

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Skills</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.title}</

I'll create a new page for hiring companies to search and view candidates. We'll add a search interface with filters and a table to display candidate results.

<lov-code>
First, let's create a new page for candidate search:

<lov-write file_path="src/pages/CandidateSearch.tsx">
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search } from "lucide-react";

// Mock data - in a real app this would come from an API
const MOCK_CANDIDATES = [
  {
    id: 1,
    name: "John Doe",
    title: "Senior React Developer",
    location: "San Francisco, CA",
    experience: "8 years",
    skills: ["React", "TypeScript", "Node.js"],
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "UX Designer",
    location: "Remote",
    experience: "5 years",
    skills: ["Figma", "User Research", "UI Design"],
  },
  {
    id: 3,
    name: "Mike Johnson",
    title: "Full Stack Engineer",
    location: "New York, NY",
    experience: "6 years",
    skills: ["Python", "React", "PostgreSQL"],
  },
];

const CandidateSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCandidates = MOCK_CANDIDATES.filter((candidate) =>
    Object.values(candidate).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">Find Candidates</h1>
        
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

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Skills</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.title}</TableCell>
                  <TableCell>{candidate.location}</TableCell>
                  <TableCell>{candidate.experience}</TableCell>
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