import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <span className="text-xl font-bold text-black">jobz.</span>
    </Link>
  );
};

export default Logo;