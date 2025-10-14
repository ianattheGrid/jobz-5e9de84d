import { useState, useEffect } from "react";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, Download } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface VirtualRecruiter {
  id: string;
  vr_number: string;
  full_name: string;
  email: string;
  location: string;
  is_active: boolean | null;
  successful_placements: number | null;
  recommendations_count: number | null;
  created_at: string;
  bank_account_verified: boolean | null;
}

export default function AdminVirtualRecruiters() {
  const [recruiters, setRecruiters] = useState<VirtualRecruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("virtual_recruiter_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecruiters(data || []);
    } catch (error) {
      console.error("Error fetching virtual recruiters:", error);
      toast.error("Failed to fetch virtual recruiters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const filteredRecruiters = recruiters.filter(
    (vr) =>
      vr.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vr.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vr.vr_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: recruiters.length,
    active: recruiters.filter((vr) => vr.is_active).length,
    verified: recruiters.filter((vr) => vr.bank_account_verified).length,
    totalPlacements: recruiters.reduce((sum, vr) => sum + (vr.successful_placements || 0), 0),
    totalReferrals: recruiters.reduce((sum, vr) => sum + (vr.recommendations_count || 0), 0),
  };

  return (
    <AdminProtectedRoute>
      <div className="container mx-auto p-8">
        <AdminNavigation />
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Virtual Recruiter Management</h1>
            <p className="text-muted-foreground">View and manage all virtual recruiters (connectors)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="p-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total VRs</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">{stats.verified}</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">{stats.totalReferrals}</div>
              <div className="text-sm text-muted-foreground">Total Referrals</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">{stats.totalPlacements}</div>
              <div className="text-sm text-muted-foreground">Placements</div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search virtual recruiters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchRecruiters}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading virtual recruiters...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>VR Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Referrals</TableHead>
                    <TableHead>Placements</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecruiters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No virtual recruiters found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecruiters.map((vr) => (
                      <TableRow key={vr.id}>
                        <TableCell className="font-medium">{vr.vr_number}</TableCell>
                        <TableCell>{vr.full_name}</TableCell>
                        <TableCell>{vr.email}</TableCell>
                        <TableCell>{vr.location}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Badge variant={vr.is_active ? "default" : "secondary"}>
                              {vr.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {vr.bank_account_verified && (
                              <Badge variant="outline">Verified</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{vr.recommendations_count || 0}</TableCell>
                        <TableCell>{vr.successful_placements || 0}</TableCell>
                        <TableCell>
                          {format(new Date(vr.created_at), "dd MMM yyyy")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
