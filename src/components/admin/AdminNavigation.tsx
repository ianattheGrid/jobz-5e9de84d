import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export const AdminNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "User Management", icon: Users },
    { path: "/admin/external-jobs", label: "External Jobs", icon: Briefcase },
  ];

  return (
    <nav className="mb-8 border-b">
      <div className="flex gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 pb-4 border-b-2 transition-colors",
                isActive
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
