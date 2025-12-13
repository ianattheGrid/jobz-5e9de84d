import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { CORE_CHAR_LIMITS, MAX_VOLUNTEERING_ITEMS } from "./constants";

interface OutsideWorkBlockProps {
  summary: string | null;
  projects: string[];
  onSummaryChange: (value: string | null) => void;
  onProjectsChange: (value: string[]) => void;
}

export function OutsideWorkBlock({
  summary,
  projects,
  onSummaryChange,
  onProjectsChange,
}: OutsideWorkBlockProps) {
  const updateProject = (index: number, value: string) => {
    const updated = [...projects];
    updated[index] = value.slice(0, CORE_CHAR_LIMITS.volunteering_item);
    onProjectsChange(updated);
  };

  const addProject = () => {
    if (projects.length < MAX_VOLUNTEERING_ITEMS) {
      onProjectsChange([...projects, '']);
    }
  };

  const removeProject = (index: number) => {
    onProjectsChange(projects.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">🌟</span> Outside Work, I'm Also…
        </h4>
        <p className="text-sm text-muted-foreground">
          Anything outside work that matters to you? (Hobbies, volunteering, side projects, etc.)
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Summary</label>
        <Textarea
          placeholder="e.g., I coach a local youth football team on weekends and am working towards my personal training qualification."
          value={summary || ''}
          onChange={(e) => onSummaryChange(e.target.value.slice(0, CORE_CHAR_LIMITS.outside_work_summary) || null)}
          maxLength={CORE_CHAR_LIMITS.outside_work_summary}
          className="mt-1 resize-none"
          rows={2}
        />
        <p className="text-xs text-muted-foreground text-right mt-1">
          {(summary || '').length}/{CORE_CHAR_LIMITS.outside_work_summary}
        </p>
      </div>

      {/* Volunteering / Side projects */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">
          Volunteering or side projects (optional)
        </label>
        <div className="space-y-2 mt-2">
          {projects.map((project, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="e.g., Treasurer for local charity since 2020"
                value={project}
                onChange={(e) => updateProject(index, e.target.value)}
                maxLength={CORE_CHAR_LIMITS.volunteering_item}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeProject(index)}
                className="text-destructive hover:text-destructive shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {projects.length < MAX_VOLUNTEERING_ITEMS && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addProject}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add volunteering / side project
          </Button>
        )}
      </div>
    </div>
  );
}
