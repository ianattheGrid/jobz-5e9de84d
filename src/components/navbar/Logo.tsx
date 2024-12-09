import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <Home className="w-5 h-5 text-primary" />
      <span className="text-xl font-bold text-black">jobz.</span>
    </Link>
  );
};

export default Logo;