import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 group">
      <div className="w-8 h-8 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
        <Home className="w-full h-full text-primary-DEFAULT" />
      </div>
      <span className="text-2xl font-bold text-black">jobz.</span>
    </Link>
  );
};

export default Logo;