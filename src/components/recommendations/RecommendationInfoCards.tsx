
import React from "react";

type InfoCardProps = {
  title: string;
  description: string;
};

export function RecommendationInfoCard({ title, description }: InfoCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
