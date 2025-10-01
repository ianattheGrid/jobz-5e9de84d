import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AdminStats } from "@/components/admin/AdminStats";
import { CompaniesTable } from "@/components/admin/CompaniesTable";
import { ExternalJobsList } from "@/components/admin/ExternalJobsList";
import { JobMatchesTable } from "@/components/admin/JobMatchesTable";

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">External Jobs Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage job scraping from Bristol SME companies
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdminStats />
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleScrapeJobs} 
                  disabled={scrapingLoading}
                  className="w-full"
                >
                  {scrapingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Scrape Jobs Now
                </Button>
                <Button 
                  onClick={handleMatchCandidates} 
                  disabled={matchingLoading}
                  className="w-full"
                  variant="secondary"
                >
                  {matchingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Match Candidates Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scraping Status:</span>
                    <span className="font-medium">
                      {scrapingLoading ? "In Progress" : "Ready"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Matching Status:</span>
                    <span className="font-medium">
                      {matchingLoading ? "In Progress" : "Ready"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies">
          <CompaniesTable />
        </TabsContent>

        <TabsContent value="jobs">
          <ExternalJobsList />
        </TabsContent>

        <TabsContent value="matches">
          <JobMatchesTable />
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
