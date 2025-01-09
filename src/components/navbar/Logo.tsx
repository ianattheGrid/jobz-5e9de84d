import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="h-8 w-auto flex items-center">
        <img src="/logo.png" alt="Talent Flare" className="h-full" onError={(e) => {
          e.currentTarget.src = '/placeholder.svg';
          e.currentTarget.onerror = null;
        }} />
      </div>
      <Home className="w-6 h-6 text-primary hidden sm:block" />
    </Link>
  );
};

export default Logo;