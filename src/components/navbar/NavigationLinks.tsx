import { Link } from "react-router-dom";

interface NavigationLinksProps {
  isAuthenticated: boolean;
  userType: string | null;
}

const NavigationLinks = ({ isAuthenticated, userType }: NavigationLinksProps) => {
  return (
    <div className="hidden md:flex space-x-4">
      <Link to="/jobs" className="text-gray-600 hover:text-gray-900">Job Board</Link>
      {isAuthenticated && userType === 'employer' && (
        <>
          <Link to="/employer/create-vacancy" className="text-gray-600 hover:text-gray-900">Post Job</Link>
          <Link to="/employer/interviews" className="text-gray-600 hover:text-gray-900">Interviews</Link>
        </>
      )}
    </div>
  );
};

export default NavigationLinks;