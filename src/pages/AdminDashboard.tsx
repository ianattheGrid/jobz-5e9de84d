import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { AppStatusManagement } from "@/components/admin/AppStatusManagement";
import { SoftLaunchMetrics } from "@/components/admin/SoftLaunchMetrics";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [appStatus, setAppStatus] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    totalCandidates: 0,
    totalEmployers: 0,
    totalVRs: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch app settings
      const { data: settings, error: settingsError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('app_name', 'localz')
        .single();

      if (settingsError) throw settingsError;
      setAppStatus(settings);

      // Fetch soft launch user counts
      const goLiveDate = settings.go_live_date || new Date().toISOString();

      const { count: candidateCount } = await supabase
        .from('candidate_profiles')
        .select('*', { count: 'exact', head: true })
        .lt('signup_date', goLiveDate);

      const { count: employerCount } = await supabase
        .from('employer_profiles')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', goLiveDate);

      const { count: vrCount } = await supabase
        .from('virtual_recruiter_profiles')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', goLiveDate);

      setMetrics({
        totalCandidates: candidateCount || 0,
        totalEmployers: employerCount || 0,
        totalVRs: vrCount || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminProtectedRoute>
    );
  }

  const totalUsers = metrics.totalCandidates + metrics.totalEmployers + metrics.totalVRs;

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage soft launch status and monitor user signups
            </p>
          </div>

          <AdminNavigation />

          <SoftLaunchMetrics
            totalCandidates={metrics.totalCandidates}
            totalEmployers={metrics.totalEmployers}
            totalVRs={metrics.totalVRs}
          />

          <AppStatusManagement
            currentStatus={appStatus}
            totalUsers={totalUsers}
            onStatusChange={fetchData}
          />
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default AdminDashboard;
