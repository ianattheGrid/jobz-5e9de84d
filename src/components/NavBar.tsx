import { Link } from "react-router-dom";
import { Building2, Search } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-DEFAULT" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Jobz</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-DEFAULT px-3 py-2 rounded-md text-sm font-medium"
            >
              Find Jobs
            </Link>
            <Link 
              to="/candidates" 
              className="flex items-center text-gray-700 hover:text-primary-DEFAULT px-3 py-2 rounded-md text-sm font-medium"
            >
              <Search className="h-4 w-4 mr-1" />
              For Employers
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;