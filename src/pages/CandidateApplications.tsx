
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard } from "lucide-react";

// Dummy data for applications
const dummyApplications = [
  {
    id: 1,
    jobTitle: "Senior Software Engineer",
    company: "Tech Solutions Ltd",
    appliedDate: "2024-03-15",
    status: "pending",
    salary: "£65,000 - £80,000"
  },
  {
    id: 2,
    jobTitle: "Full Stack Developer",
    company: "Digital Innovations",
    appliedDate: "2024-03-14",
    status: "accepted",
    salary: "£55,000 - £70,000"
  },
  {
    id: 3,
    jobTitle: "React Developer",
    company: "Web Creators",
    appliedDate: "2024-03-10",
    status: "rejected",
    salary: "£45,000 - £60,000"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-yellow-500';
  }
};

const CandidateApplications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600">Track your job applications and their status</p>
          </div>
          <Button
            onClick={() => navigate('/candidate/dashboard')}
            className="text-white"
            variant="default"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Job Title</TableHead>
                <TableHead className="text-gray-700">Company</TableHead>
                <TableHead className="text-gray-700">Applied Date</TableHead>
                <TableHead className="text-gray-700">Salary Range</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyApplications.map((application) => (
                <TableRow key={application.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{application.jobTitle}</TableCell>
                  <TableCell className="text-gray-700">{application.company}</TableCell>
                  <TableCell className="text-gray-700">{application.appliedDate}</TableCell>
                  <TableCell className="text-gray-700">{application.salary}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(application.status)} text-white`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
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

export default CandidateApplications;
