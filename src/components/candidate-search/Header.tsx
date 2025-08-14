
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function Header() {
  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/employer/dashboard" className="text-primary hover:text-primary/90">
                Employer Dashboard
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-white">Candidate Search</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Link to="/employer/dashboard">
          <Button 
            className="bg-[#FF69B4] hover:bg-[#FF50A8] text-white gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Candidate Search</h1>
        <p className="text-gray-600 mt-2">
          Search for candidates that match your job requirements. Save searches to get notified when new matching candidates join.
        </p>
      </div>
      
      <div className="bg-[#FF69B4] h-2 w-full rounded-full"></div>
    </div>
  );
}
