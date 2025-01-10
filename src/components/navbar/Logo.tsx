import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <img 
        src="/logo.png" 
        alt="Talent Flare" 
        className="h-8 w-auto"
      />
    </Link>
  );
};

export default Logo;