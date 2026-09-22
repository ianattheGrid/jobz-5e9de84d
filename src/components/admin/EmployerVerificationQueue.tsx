import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface EmployerRow {
  id: string;
  company_name: string | null;
  company_website: string | null;
  company_email: string | null;
  companies_house_number: string | null;
  verification_status: string;
  verification_method: string | null;
}

/** Admin review: verify a company, or revoke access after a spot check. */
export const EmployerVerificationQueue = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<EmployerRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("employer_profiles")
      .select(
        "id, company_name, company_website, company_email, companies_house_number, verification_status, verification_method"
      )
      .order("created_at", { ascending: false });
    setRows((data || []) as any);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("employer_profiles")
      .update({
        verification_status: status,
        verified_at: status === "verified" ? new Date().toISOString() : null,
        verification_method: status === "verified" ? "admin" : "admin_revoked",
      } as any)
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Could not update", description: error.message });
      return;
    }
    toast({ title: status === "verified" ? "Company verified" : "Access removed" });
    load();
  };

  if (loading) return null;

  const pending = rows.filter((r) => r.verification_status !== "verified");
  const verified = rows.filter((r) => r.verification_status === "verified");

  const Row = ({ r }: { r: EmployerRow }) => (
    <div className="rounded-lg border p-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-medium">{r.company_name || "No company name"}</p>
        <p className="text-sm text-muted-foreground">
          {r.company_website || "no website"} · {r.company_email || "no work email"}
          {r.companies_house_number ? ` · CH ${r.companies_house_number}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={r.verification_status === "verified" ? "secondary" : "outline"}>
          {r.verification_status}
          {r.verification_method ? ` · ${r.verification_method}` : ""}
        </Badge>
        {r.verification_status === "verified" ? (
          <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "revoked")}>
            Remove access
          </Button>
        ) : (
          <Button size="sm" onClick={() => setStatus(r.id, "verified")}>
            Verify
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employer verification</CardTitle>
        <CardDescription>
          Only verified companies can see match results or ask candidates for their details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium">Waiting ({pending.length})</p>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing waiting.</p>
          ) : (
            pending.map((r) => <Row key={r.id} r={r} />)
          )}
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium">Verified ({verified.length})</p>
          {verified.map((r) => (
            <Row key={r.id} r={r} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
