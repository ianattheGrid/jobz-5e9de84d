import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <Home className="w-8 h-8 text-primary-DEFAULT" />
      <span className="text-2xl font-bold text-primary-DEFAULT">jobz.</span>
    </Link>
  );
};

export default Logo;