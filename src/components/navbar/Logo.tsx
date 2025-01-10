import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="h-8 w-auto">
        <img 
          src="/logo.png" 
          alt="Talent Flare" 
          className="h-full w-auto object-contain"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
            e.currentTarget.onerror = null;
          }} 
        />
      </div>
    </Link>
  );
};

export default Logo;