import { Link } from "react-router-dom";

interface NavigationLinksProps {
  isAuthenticated: boolean;
  userType: string | null;
}

const NavigationLinks = ({ isAuthenticated, userType }: NavigationLinksProps) => {
  return (
    <div className="hidden">
      {/* Hide the navigation links since we're using hamburger menu for all devices */}
    </div>
  );
};

export default NavigationLinks;