import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, UserCheck, TrendingUp } from "lucide-react";

interface MetricsProps {
  totalCandidates: number;
  totalEmployers: number;
  totalVRs: number;
}

export const SoftLaunchMetrics = ({ totalCandidates, totalEmployers, totalVRs }: MetricsProps) => {
  const totalUsers = totalCandidates + totalEmployers + totalVRs;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Soft launch signups
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Candidates</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCandidates}</div>
          <p className="text-xs text-muted-foreground">
            {((totalCandidates / totalUsers) * 100).toFixed(0)}% of total users
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Employers</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployers}</div>
          <p className="text-xs text-muted-foreground">
            {((totalEmployers / totalUsers) * 100).toFixed(0)}% of total users
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Virtual Recruiters</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVRs}</div>
          <p className="text-xs text-muted-foreground">
            {totalVRs > 0 ? `${((totalVRs / totalUsers) * 100).toFixed(0)}% of total users` : 'None yet'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
