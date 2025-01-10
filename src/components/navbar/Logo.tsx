import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/logo.png" 
        alt="Talent Flare" 
        className="h-8"
      />
    </Link>
  );
};

export default Logo;