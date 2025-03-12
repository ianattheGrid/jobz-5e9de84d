
import React from "react";
import NavBar from "@/components/NavBar";
import LoadingSpinner from "./LoadingSpinner";

interface InterviewsLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

const InterviewsLayout = ({ children, isLoading }: InterviewsLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-8 pt-20">
        {isLoading ? <LoadingSpinner /> : children}
      </div>
    </div>
  );
};

export default InterviewsLayout;
