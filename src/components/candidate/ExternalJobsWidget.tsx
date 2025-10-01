import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight } from "lucide-react";

const ExternalJobsWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matchCount, setMatchCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetchMatchCount();
  }, [user]);

  const fetchMatchCount = async () => {
    try {
      const { count, error } = await supabase
        .from('external_job_matches')
        .select('*', { count: 'exact', head: true })
        .eq('candidate_id', user!.id)
        .is('candidate_interested', null);

      if (error) throw error;

      setMatchCount(count || 0);
    } catch (error) {
      console.error('Error fetching match count:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || matchCount === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Bristol SME Opportunities
        </CardTitle>
        <CardDescription>
          Jobs from local SMEs matching your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-2xl font-bold text-blue-600">
            {matchCount} {matchCount === 1 ? 'opportunity' : 'opportunities'}
          </p>
          <p className="text-sm text-muted-foreground">
            We found Bristol-based SMEs actively hiring for roles that match your skills and experience.
          </p>
          <Button 
            onClick={() => navigate('/external-jobs')}
            className="w-full flex items-center justify-center gap-2"
          >
            View Opportunities
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalJobsWidget;
