import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onAdd: (input: {
    company: string;
    roleTitle: string;
    jobUrl?: string;
    source?: string;
    appliedOn: string;
    notes?: string;
  }) => Promise<void>;
}

const today = () => new Date().toISOString().slice(0, 10);

export const AddJobDialog = ({ onAdd }: Props) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [source, setSource] = useState("");
  const [appliedOn, setAppliedOn] = useState(today());
  const [notes, setNotes] = useState("");

  const reset = () => {
    setCompany("");
    setRoleTitle("");
    setJobUrl("");
    setSource("");
    setAppliedOn(today());
    setNotes("");
  };

  const submit = async () => {
    if (!company.trim() || !roleTitle.trim()) {
      toast({
        title: "Two things missing",
        description: "Please add the company and the job title.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      await onAdd({ company, roleTitle, jobUrl, source, appliedOn, notes });
      toast({ title: "Added to your board" });
      reset();
      setOpen(false);
    } catch (e: any) {
      toast({
        title: "Could not add that",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add a job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a job you applied for</DialogTitle>
          <DialogDescription>
            Anywhere at all — another site, an email, a friend of a friend. Only you can see this.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="jh-company">Company</Label>
            <Input
              id="jh-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Brittle Solutions"
            />
          </div>
          <div>
            <Label htmlFor="jh-role">Job title</Label>
            <Input
              id="jh-role"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="Warehouse Supervisor"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="jh-date">Date you applied</Label>
              <Input
                id="jh-date"
                type="date"
                value={appliedOn}
                onChange={(e) => setAppliedOn(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="jh-source">Where you found it</Label>
              <Input
                id="jh-source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Indeed"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="jh-url">Link to the advert (optional)</Label>
            <Input
              id="jh-url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://"
            />
          </div>
          <div>
            <Label htmlFor="jh-notes">Notes (optional)</Label>
            <Textarea
              id="jh-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Spoke to Sam on reception. Said they'd come back by Friday."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? "Adding…" : "Add to my board"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
