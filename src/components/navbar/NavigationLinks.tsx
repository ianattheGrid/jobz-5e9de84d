import { Link } from "react-router-dom";

interface NavigationLinksProps {
  isAuthenticated: boolean;
  userType: string | null;
}

const NavigationLinks = ({ isAuthenticated, userType }: NavigationLinksProps) => {
  return (
    <div className="flex-1 flex justify-end items-center">
      <div className="flex space-x-4">
        <Link to="/jobs" className="text-gray-600 hover:text-gray-900">
          {userType === 'employer' ? 'Your Job Postings' : 'Job Board'}
        </Link>
        {isAuthenticated && userType === 'employer' && (
          <>
            <Link to="/employer/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link to="/employer/candidate-search" className="text-gray-600 hover:text-gray-900">Search Candidates</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavigationLinks;