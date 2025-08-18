import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PortfolioUploadProps {
  onUpload: (file: File, title: string, description: string) => Promise<boolean>;
  uploading: boolean;
}

export const PortfolioUpload = ({ onUpload, uploading }: PortfolioUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-populate title with filename (without extension)
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
      if (!title) {
        setTitle(nameWithoutExt);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file || !title.trim()) {
      return;
    }

    const success = await onUpload(file, title.trim(), description.trim());
    
    if (success) {
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      // Reset file input
      const fileInput = document.getElementById('portfolio-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add Portfolio Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="portfolio-file">
              Upload File *
            </Label>
            <Input
              id="portfolio-file"
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.txt"
              required
              disabled={uploading}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Supported: Images, PDFs, Documents (max 10MB)
            </p>
          </div>

          <div>
            <Label htmlFor="portfolio-title">
              Title *
            </Label>
            <Input
              id="portfolio-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this portfolio item"
              required
              disabled={uploading}
            />
          </div>

          <div>
            <Label htmlFor="portfolio-description">
              Description
            </Label>
            <Textarea
              id="portfolio-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this portfolio item (optional)"
              rows={3}
              disabled={uploading}
            />
          </div>

          <Button 
            type="submit" 
            disabled={!file || !title.trim() || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Add to Portfolio
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};