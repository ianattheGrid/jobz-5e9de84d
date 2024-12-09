import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <Home className="w-8 h-8 text-[#6E59A5]" />
      <span className="text-2xl font-bold text-[#6E59A5]">jobz.</span>
    </Link>
  );
};

export default Logo;