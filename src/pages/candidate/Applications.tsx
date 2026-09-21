import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AddJobDialog } from "@/components/candidate/job-hunt/AddJobDialog";
import { JobHuntCard } from "@/components/candidate/job-hunt/JobHuntCard";
import { STAGES, Stage, useJobHuntBoard } from "@/hooks/useJobHuntBoard";

const CandidateApplications = () => {
  const { toast } = useToast();
  const { items, loading, error, addJob, moveJob, removeJob } = useJobHuntBoard();

  const handleMove = async (id: string, stage: Stage) => {
    try {
      await moveJob(id, stage);
    } catch (e: any) {
      toast({
        title: "Could not move that",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeJob(id);
      toast({ title: "Removed from your board" });
    } catch (e: any) {
      toast({
        title: "Could not remove that",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-2 text-muted-foreground">Loading your job hunt…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">My job hunt</h1>
            <p className="max-w-2xl text-muted-foreground">
              Everything you've applied for, in one place. Jobs you applied for on Jobz appear here
              on their own. Add the ones you found elsewhere. Nobody else can see this page.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/candidate/my-cv">Download my CV</Link>
            </Button>
            <AddJobDialog onAdd={addJob} />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {STAGES.map((stage) => {
            const columnItems = items.filter((i) => i.stage === stage.key);
            return (
              <div key={stage.key} className="rounded-3xl border border-border bg-card/40 p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">{stage.label}</h2>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-muted-foreground">
                      {columnItems.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stage.hint}</p>
                </div>

                <div className="space-y-3">
                  {columnItems.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                      Nothing here yet.
                    </p>
                  ) : (
                    columnItems.map((item) => (
                      <JobHuntCard
                        key={item.id}
                        item={item}
                        onMove={handleMove}
                        onRemove={handleRemove}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CandidateApplications;
