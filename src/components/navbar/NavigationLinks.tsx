import { Link } from "react-router-dom";

interface NavigationLinksProps {
  isAuthenticated: boolean;
  userType: string | null;
}

const NavigationLinks = ({ isAuthenticated, userType }: NavigationLinksProps) => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="flex space-x-8">
        <Link to="/jobs" className="text-gray-600 hover:text-gray-900 font-medium">
          Job Board
        </Link>
        {isAuthenticated && userType === 'employer' && (
          <Link to="/employer/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
            Dashboard
          </Link>
        )}
        {isAuthenticated && userType === 'candidate' && (
          <Link to="/candidate/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
            Dashboard
          </Link>
        )}
        {isAuthenticated && userType === 'vr' && (
          <Link to="/vr/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
            Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavigationLinks;