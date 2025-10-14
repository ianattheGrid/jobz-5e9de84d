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

interface Candidate {
  id: string;
  email: string;
  full_name: string | null;
  job_title: string;
  location: string[];
  years_experience: number;
  min_salary: number;
  max_salary: number;
  created_at: string;
  cv_url: string | null;
  profile_picture_url: string | null;
}

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("candidate_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: candidates.length,
    withCV: candidates.filter((c) => c.cv_url).length,
    withPhoto: candidates.filter((c) => c.profile_picture_url).length,
    newThisWeek: candidates.filter(
      (c) => new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
  };

  return (
    <AdminProtectedRoute>
      <div className="container mx-auto p-8">
        <AdminNavigation />
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Candidate Management</h1>
            <p className="text-muted-foreground">View and manage all candidate profiles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Candidates</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">{stats.newThisWeek}</div>
              <div className="text-sm text-muted-foreground">New This Week</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">{stats.withCV}</div>
              <div className="text-sm text-muted-foreground">With CV</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">{stats.withPhoto}</div>
              <div className="text-sm text-muted-foreground">With Photo</div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchCandidates}>
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
              <div className="text-center py-8 text-muted-foreground">Loading candidates...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Salary Range</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Profile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No candidates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">
                          {candidate.full_name || "—"}
                        </TableCell>
                        <TableCell>{candidate.email}</TableCell>
                        <TableCell>{candidate.job_title}</TableCell>
                        <TableCell>{candidate.years_experience} years</TableCell>
                        <TableCell>
                          £{candidate.min_salary.toLocaleString()} - £{candidate.max_salary.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {candidate.location?.[0] || "—"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(candidate.created_at), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {candidate.cv_url && (
                              <Badge variant="secondary">CV</Badge>
                            )}
                            {candidate.profile_picture_url && (
                              <Badge variant="secondary">Photo</Badge>
                            )}
                          </div>
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
