import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <img 
        src="/logo.png" 
        alt="Talent Flare" 
        className="h-8 w-auto object-contain"
        onError={(e) => {
          e.currentTarget.src = '/placeholder.svg';
          e.currentTarget.onerror = null;
        }} 
      />
    </Link>
  );
};

export default Logo;