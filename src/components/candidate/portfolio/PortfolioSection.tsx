import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCandidatePortfolio } from '@/hooks/useCandidatePortfolio';
import { PortfolioUpload } from './PortfolioUpload';
import { PortfolioDisplay } from './PortfolioDisplay';

interface PortfolioSectionProps {
  userId: string;
}

export const PortfolioSection = ({ userId }: PortfolioSectionProps) => {
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const { portfolioItems, uploading, uploadPortfolioItem, deletePortfolioItem } = useCandidatePortfolio(userId);

  // Check if user already has portfolio items and update toggle accordingly
  React.useEffect(() => {
    if (portfolioItems.length > 0) {
      setHasPortfolio(true);
    }
  }, [portfolioItems]);

  const handleToggleChange = (checked: boolean) => {
    setHasPortfolio(checked);
    // If turning off portfolio, optionally could ask to confirm deletion
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="has-portfolio"
            checked={hasPortfolio}
            onCheckedChange={handleToggleChange}
          />
          <Label htmlFor="has-portfolio">
            Do you have a portfolio to showcase?
          </Label>
        </div>

        {hasPortfolio && (
          <div className="space-y-6">
            <PortfolioUpload
              onUpload={uploadPortfolioItem}
              uploading={uploading}
            />
            
            {portfolioItems.length > 0 && (
              <PortfolioDisplay
                items={portfolioItems}
                onDelete={deletePortfolioItem}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};