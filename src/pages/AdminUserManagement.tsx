import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { UserSearchFilter } from "@/components/admin/UserSearchFilter";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { UserDetailDrawer } from "@/components/admin/UserDetailDrawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, Briefcase, UserCheck } from "lucide-react";
import { calculateCandidateCompletion, calculateEmployerCompletion, calculateVRCompletion } from "@/utils/admin/calculateProfileCompletion";

const AdminUserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);
  const [vrs, setVRs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [completionFilter, setCompletionFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedUserType, setSelectedUserType] = useState<'candidate' | 'employer' | 'vr'>('candidate');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      // Fetch candidates
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidate_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (candidateError) throw candidateError;

      const candidatesWithCompletion = (candidateData || []).map(c => ({
        ...c,
        user_type: 'candidate' as const,
        profile_completion: calculateCandidateCompletion(c),
      }));

      // Fetch employers
      const { data: employerData, error: employerError } = await supabase
        .from('employer_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (employerError) throw employerError;

      const employersWithCompletion = (employerData || []).map(e => ({
        ...e,
        user_type: 'employer' as const,
        profile_completion: calculateEmployerCompletion(e),
      }));

      // Fetch VRs
      const { data: vrData, error: vrError } = await supabase
        .from('virtual_recruiter_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (vrError) throw vrError;

      const vrsWithCompletion = (vrData || []).map(v => ({
        ...v,
        user_type: 'vr' as const,
        profile_completion: calculateVRCompletion(v),
      }));

      setCandidates(candidatesWithCompletion);
      setEmployers(employersWithCompletion);
      setVRs(vrsWithCompletion);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filterUsers = (users: any[]) => {
    return users.filter(user => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (user.full_name?.toLowerCase().includes(searchLower)) ||
        (user.company_name?.toLowerCase().includes(searchLower)) ||
        (user.email?.toLowerCase().includes(searchLower)) ||
        (user.vr_number?.toLowerCase().includes(searchLower));

      if (searchTerm && !matchesSearch) return false;

      // Completion filter
      if (completionFilter !== 'all') {
        const completion = user.profile_completion;
        const [min, max] = completionFilter.split('-').map(Number);
        if (completion < min || completion > max) return false;
      }

      return true;
    });
  };

  const getAllUsers = () => {
    let allUsers = [...candidates, ...employers, ...vrs];
    
    if (userTypeFilter !== 'all') {
      allUsers = allUsers.filter(u => u.user_type === userTypeFilter);
    }
    
    return filterUsers(allUsers);
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setSelectedUserType(user.user_type);
    setDrawerOpen(true);
  };

  const totalUsers = candidates.length + employers.length + vrs.length;
  const filteredCandidates = filterUsers(candidates);
  const filteredEmployers = filterUsers(employers);
  const filteredVRs = filterUsers(vrs);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Search, filter, and manage all registered users
            </p>
          </div>

          <AdminNavigation />

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidates</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{candidates.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employers</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Virtual Recruiters</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vrs.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <UserSearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            userTypeFilter={userTypeFilter}
            onUserTypeChange={setUserTypeFilter}
            completionFilter={completionFilter}
            onCompletionChange={setCompletionFilter}
          />

          {/* Tabs */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Users ({getAllUsers().length})</TabsTrigger>
              <TabsTrigger value="candidates">Candidates ({filteredCandidates.length})</TabsTrigger>
              <TabsTrigger value="employers">Employers ({filteredEmployers.length})</TabsTrigger>
              <TabsTrigger value="vrs">Virtual Recruiters ({filteredVRs.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <UserManagementTable
                users={getAllUsers()}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            <TabsContent value="candidates" className="space-y-4">
              <UserManagementTable
                users={filteredCandidates}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            <TabsContent value="employers" className="space-y-4">
              <UserManagementTable
                users={filteredEmployers}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            <TabsContent value="vrs" className="space-y-4">
              <UserManagementTable
                users={filteredVRs}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <UserDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        user={selectedUser}
        userType={selectedUserType}
      />
    </AdminProtectedRoute>
  );
};

export default AdminUserManagement;
