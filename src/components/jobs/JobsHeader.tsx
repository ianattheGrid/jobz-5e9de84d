import { useNavigate } from "react-router-dom";

interface JobsHeaderProps {
  userType: string | null;
  jobCount: number;
}

const JobsHeader = ({ userType }: JobsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">
        Job Board
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