import { useNavigate } from "react-router-dom";

interface JobsHeaderProps {
  userType: string | null;
  jobCount: number;
}

const JobsHeader = ({ userType, jobCount }: JobsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">
        {userType === 'employer' ? 'Your Job Postings' : 'Available Positions'} ({jobCount})
      </h1>
      {userType === 'employer' && (
        <button
          onClick={() => navigate('/employer/create-vacancy')}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-800 hover:bg-red-900 text-white h-10 px-4 py-2"
        >
          Post New Job
        </button>
      )}
    </div>
  );
};

export default JobsHeader;