import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCandidatePortfolio } from '@/hooks/useCandidatePortfolio';
import { PortfolioDisplay } from '@/components/candidate/portfolio/PortfolioDisplay';

interface PortfolioSectionProps {
  candidateId: string;
}

export const PortfolioSection = ({ candidateId }: PortfolioSectionProps) => {
  const { portfolioItems } = useCandidatePortfolio(candidateId);

  // Don't show section if no portfolio items
  if (portfolioItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <PortfolioDisplay 
          items={portfolioItems} 
          onDelete={() => Promise.resolve()} // No delete on public view
          showDelete={false}
        />
      </CardContent>
    </Card>
  );
};