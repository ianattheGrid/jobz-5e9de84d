
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LayoutDashboard } from "lucide-react";
import { useApplicationsList } from "@/hooks/useApplicationsList";
import { format } from "date-fns";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0
  }).format(amount);
};

const CandidateApplications = () => {
  const navigate = useNavigate();
  const { data: applications, isLoading, error } = useApplicationsList();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Failed to load applications</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600">Track your job applications history</p>
          </div>
          <Button
            onClick={() => navigate('/candidate/dashboard')}
            className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white"
            variant="default"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>

        {applications && applications.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700">Job Title</TableHead>
                  <TableHead className="text-gray-700">Company</TableHead>
                  <TableHead className="text-gray-700">Salary Range</TableHead>
                  <TableHead className="text-gray-700">Applied On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">
                      {application.jobs?.title}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {application.jobs?.company}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {application.jobs?.salary_min && application.jobs?.salary_max ? (
                        <span>
                          {formatCurrency(application.jobs.salary_min)} - {formatCurrency(application.jobs.salary_max)}
                        </span>
                      ) : (
                        'Not specified'
                      )}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {format(new Date(application.created_at), 'dd MMM yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">No applications found</p>
            <Button
              onClick={() => navigate('/jobs')}
              className="mt-4"
              variant="default"
            >
              Browse Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateApplications;
