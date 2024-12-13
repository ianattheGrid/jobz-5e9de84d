import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CandidateApplicationsProps {
  userId: string;
}

const CandidateApplications = ({ userId }: CandidateApplicationsProps) => {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(
            title,
            company,
            location
          )
        `)
        .eq('applicant_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {applications?.length === 0 ? (
          <p className="text-gray-500">You haven't applied to any jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {applications?.map((application) => (
              <Card key={application.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{application.job.title}</h3>
                    <p className="text-sm text-gray-500">{application.job.company}</p>
                    <p className="text-sm text-gray-500">{application.job.location}</p>
                  </div>
                  <Badge variant={application.status === 'pending' ? 'secondary' : 
                                application.status === 'reviewing' ? 'default' :
                                application.status === 'accepted' ? 'default' : 'destructive'}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CandidateApplications;