import { Link } from "react-router-dom";

interface NavigationLinksProps {
  isAuthenticated: boolean;
  userType: string | null;
}

const NavigationLinks = ({ isAuthenticated, userType }: NavigationLinksProps) => {
  return (
    <div className="ml-auto">
      <div className="hidden md:flex space-x-4">
        <Link to="/jobs" className="text-gray-600 hover:text-gray-900">Job Board</Link>
      </div>
    </div>
  );
};

export default NavigationLinks;