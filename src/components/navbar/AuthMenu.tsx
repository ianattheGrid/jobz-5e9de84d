import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthMenuProps {
  isAuthenticated: boolean;
  handleSignOut: () => Promise<void>;
}

const AuthMenu = ({ isAuthenticated, handleSignOut }: AuthMenuProps) => {
  if (isAuthenticated) {
    return null;
  }

  return null; // Removed the entire dropdown menu
};

export default AuthMenu;