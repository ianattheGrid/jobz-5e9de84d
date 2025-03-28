import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const DashboardMenu = () => {
  const navigate = useNavigate();
  
  // Empty menu items array
  const menuItems = [];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {menuItems.map((item: any, index: number) => (
        <div key={index} className="text-center">
          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-28 w-28 rounded-md hover:bg-red-50 transition-all duration-200 border border-gray-200"
            onClick={() => {
              console.log('Navigating to:', item.path);
              navigate(item.path);
            }}
          >
            <div className="text-red-800 mb-2">{item.icon}</div>
            <div className="text-center">
              <p className="text-sm text-red-800 font-medium">{item.title}</p>
            </div>
          </Button>
        </div>
      ))}
    </div>
  );
};
