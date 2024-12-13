import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, MessageSquare, Users } from "lucide-react";
import CandidateApplications from "@/components/candidate/CandidateApplications";
import CandidateJobMatches from "@/components/candidate/CandidateJobMatches";
import CandidateInterviews from "@/components/candidate/CandidateInterviews";

const CandidateDashboard = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || userType !== 'candidate') {
      navigate('/candidate/signin');
    }
  }, [user, userType, navigate]);

  if (!user) return null;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Candidate Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">
              <Briefcase className="h-4 w-4 inline-block mr-2" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">
              <Users className="h-4 w-4 inline-block mr-2" />
              Job Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">
              <MessageSquare className="h-4 w-4 inline-block mr-2" />
              Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <CandidateApplications userId={user.id} />
        <CandidateJobMatches userId={user.id} />
        <CandidateInterviews userId={user.id} />
      </div>
    </div>
  );
};

export default CandidateDashboard;