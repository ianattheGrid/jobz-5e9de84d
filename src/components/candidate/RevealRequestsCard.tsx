import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMyRevealRequests } from "@/hooks/useRevealRequests";

/** Candidate inbox: companies asking to see the full profile, with share or decline. */
export const RevealRequestsCard = () => {
  const { requests, loading, respond, block } = useMyRevealRequests();

  if (loading || requests.length === 0) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Companies asking to see you</CardTitle>
        <CardDescription>
          Nothing personal has been shared. Share only with the companies you want to.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="rounded-lg border p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{r.company_name || "A company on Jobz"}</p>
                {r.job_title && (
                  <p className="text-sm text-muted-foreground">For their role: {r.job_title}</p>
                )}
              </div>
              {r.status === "shared" && <Badge variant="secondary">Shared</Badge>}
              {r.status === "declined" && <Badge variant="outline">Declined</Badge>}
            </div>

            {r.note && <p className="text-sm text-muted-foreground italic">"{r.note}"</p>}

            {r.status === "pending" && (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => respond(r.id, "shared")}>
                  Share my details
                </Button>
                <Button size="sm" variant="outline" onClick={() => respond(r.id, "declined")}>
                  Decline
                </Button>
                <Button size="sm" variant="ghost" onClick={() => block(r.employer_id)}>
                  Block this company
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
