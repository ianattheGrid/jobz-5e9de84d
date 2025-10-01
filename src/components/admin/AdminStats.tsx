import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Briefcase, Users, TrendingUp } from "lucide-react";

interface Stats {
  totalCompanies: number;
  activeCompanies: number;
  totalJobs: number;
  totalMatches: number;
  avgMatchScore: number;
  interestedCandidates: number;
}

export function AdminStats() {
  const [stats, setStats] = useState<Stats>({
    totalCompanies: 0,
    activeCompanies: 0,
    totalJobs: 0,
    totalMatches: 0,
    avgMatchScore: 0,
    interestedCandidates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch companies stats
        const { data: companies } = await supabase
          .from('target_companies')
          .select('is_active');

        // Fetch jobs count
        const { count: jobsCount } = await supabase
          .from('external_jobs')
          .select('*', { count: 'exact', head: true });

        // Fetch matches stats
        const { data: matches } = await supabase
          .from('external_job_matches')
          .select('match_score, candidate_interested');

        const totalCompanies = companies?.length || 0;
        const activeCompanies = companies?.filter(c => c.is_active).length || 0;
        const totalMatches = matches?.length || 0;
        const avgMatchScore = matches?.length
          ? Math.round(matches.reduce((sum, m) => sum + m.match_score, 0) / matches.length)
          : 0;
        const interestedCandidates = matches?.filter(m => m.candidate_interested === true).length || 0;

        setStats({
          totalCompanies,
          activeCompanies,
          totalJobs: jobsCount || 0,
          totalMatches,
          avgMatchScore,
          interestedCandidates,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-muted-foreground">Loading statistics...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCompanies}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeCompanies} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jobs Scraped</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalJobs}</div>
          <p className="text-xs text-muted-foreground">
            External job postings
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMatches}</div>
          <p className="text-xs text-muted-foreground">
            {stats.interestedCandidates} interested
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Match Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgMatchScore}%</div>
          <p className="text-xs text-muted-foreground">
            Match quality
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
