import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Eye, FileText, Image, File } from 'lucide-react';
import { PortfolioItem } from '@/hooks/useCandidatePortfolio';

interface PortfolioDisplayProps {
  items: PortfolioItem[];
  onDelete: (itemId: string, fileUrl: string) => Promise<void>;
  showDelete?: boolean;
}

export const PortfolioDisplay = ({ items, onDelete, showDelete = true }: PortfolioDisplayProps) => {
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return 'bg-green-100 text-green-800';
      case 'pdf':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleView = (item: PortfolioItem) => {
    if (item.signed_url) {
      window.open(item.signed_url, '_blank');
    }
  };

  const handleDownload = (item: PortfolioItem) => {
    if (item.signed_url) {
      const link = document.createElement('a');
      link.href = item.signed_url;
      link.download = item.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No portfolio items yet. Upload your first item above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Portfolio Items ({items.length})</h3>
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-muted-foreground">
                    {getFileIcon(item.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge 
                        variant="secondary" 
                        className={getFileTypeColor(item.file_type)}
                      >
                        {item.file_type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.file_name}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(item)}
                    title="View file"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(item)}
                    title="Download file"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {showDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(item.id, item.file_url)}
                      title="Delete item"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};