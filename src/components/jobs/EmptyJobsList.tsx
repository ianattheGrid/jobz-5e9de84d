import { useNavigate } from "react-router-dom";

interface EmptyJobsListProps {
  userType: string | null;
}

const EmptyJobsList = ({ userType }: EmptyJobsListProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="text-center text-gray-500">
        {userType === 'employer' ? (
          <div className="space-y-4">
            <p>You haven't posted any jobs yet.</p>
            <button
              onClick={() => navigate('/employer/create-vacancy')}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-800 hover:bg-red-900 text-white h-10 px-4 py-2"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          "No jobs available at the moment."
        )}
      </div>
    </div>
  );
};

export default EmptyJobsList;