import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="h-8 w-auto flex items-center">
        <img src="/logo.png" alt="Talent Flare" className="h-full" onError={(e) => {
          e.currentTarget.src = '/placeholder.svg';
          e.currentTarget.onerror = null;
        }} />
      </div>
    </Link>
  );
};

export default Logo;