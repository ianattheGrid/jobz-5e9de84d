import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img src="/logo.png" alt="jobz" className="h-8 w-auto" />
    </Link>
  );
};

export default Logo;