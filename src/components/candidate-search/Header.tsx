
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

export function Header() {
  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex justify-end">
        <Link to="/employer/dashboard">
          <Button 
            className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Candidate Search</h1>
      <p className="text-gray-600">
        Search for candidates that match your job requirements.
      </p>
      <div className="bg-[#FF69B4] h-2 w-full rounded-full"></div>
    </div>
  );
}
