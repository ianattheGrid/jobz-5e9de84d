import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminExternalJobs() {
  const [scrapingLoading, setScrapingLoading] = useState(false);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const { toast } = useToast();

  const handleScrapeJobs = async () => {
    setScrapingLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-external-jobs');
      
      if (error) throw error;
      
      toast({
        title: "Scraping Complete",
        description: `Found ${data.totalJobsScraped} jobs from ${data.companiesProcessed} companies`,
      });
    } catch (error: any) {
      toast({
        title: "Scraping Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setScrapingLoading(false);
    }
  };

  const handleMatchCandidates = async () => {
    setMatchingLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('match-external-jobs');
      
      if (error) throw error;
      
      toast({
        title: "Matching Complete",
        description: `Created ${data.matchesCreated} matches and sent ${data.notificationsSent} notifications`,
      });
    } catch (error: any) {
      toast({
        title: "Matching Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setMatchingLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">External Jobs Admin</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scrape Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Scrape job postings from Bristol SME company career pages
            </p>
            <Button 
              onClick={handleScrapeJobs} 
              disabled={scrapingLoading}
              className="w-full"
            >
              {scrapingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Scrape Jobs Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Match Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Match scraped jobs with Bristol candidates and send notifications
            </p>
            <Button 
              onClick={handleMatchCandidates} 
              disabled={matchingLoading}
              className="w-full"
            >
              {matchingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Match Candidates Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
