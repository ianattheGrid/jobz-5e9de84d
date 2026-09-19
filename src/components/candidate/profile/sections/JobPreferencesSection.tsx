import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import {
  GlowCard,
  GlowCardContent,
  GlowCardDescription,
  GlowCardHeader,
  GlowCardTitle,
} from "@/components/ui/glow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save } from "lucide-react";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import { workAreas } from "@/components/work-area/constants/work-areas";
import { cn } from "@/lib/utils";

interface JobPreferencesSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

const LOCATION_OPTIONS = ["Bristol", ...bristolPostcodes];

export function JobPreferencesSection({ userId, profileData, onSave }: JobPreferencesSectionProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [desiredJobTitle, setDesiredJobTitle] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [workArea, setWorkArea] = useState("");
  const [specialization, setSpecialization] = useState("");

  useEffect(() => {
    if (!profileData) return;
    const p = profileData as any;
    setJobTitle(p.job_title && p.job_title !== "Not specified" ? p.job_title : "");
    setDesiredJobTitle(p.desired_job_title || "");
    setYearsExperience(p.years_experience ? String(p.years_experience) : "");
    setMinSalary(p.min_salary ? String(p.min_salary) : "");
    setMaxSalary(p.max_salary ? String(p.max_salary) : "");
    setLocations(Array.isArray(p.location) ? p.location : []);
    setWorkArea(p.workArea || "");
    setSpecialization(p.itSpecialization || "");
  }, [profileData]);

  const toggleLocation = (value: string) => {
    setLocations((prev) =>
      prev.includes(value) ? prev.filter((l) => l !== value) : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    const min = parseInt(minSalary, 10);
    const max = parseInt(maxSalary, 10);

    if (!jobTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Job title needed",
        description: "Add your current or most recent job title so employers can match you.",
      });
      return;
    }
    if (!locations.length) {
      toast({
        variant: "destructive",
        title: "Choose at least one location",
        description: "Pick the areas where you would like to work.",
      });
      return;
    }
    if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max <= 0) {
      toast({
        variant: "destructive",
        title: "Add your salary range",
        description: "Enter the minimum and maximum salary you would consider.",
      });
      return;
    }
    if (min > max) {
      toast({
        variant: "destructive",
        title: "Check your salary range",
        description: "The minimum salary cannot be higher than the maximum.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("candidate_profiles")
        .update({
          job_title: jobTitle.trim(),
          desired_job_title: desiredJobTitle.trim() || jobTitle.trim(),
          years_experience: yearsExperience ? parseInt(yearsExperience, 10) : null,
          min_salary: min,
          max_salary: max,
          location: locations,
          workArea: workArea || null,
          itSpecialization: specialization.trim() || null,
        } as any)
        .eq("id", userId);

      if (error) throw error;

      toast({ title: "Success", description: "Job preferences saved" });
      onSave();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Job Preferences</GlowCardTitle>
          <GlowCardDescription>
            These details drive your match score. Without them, employers' vacancies will show a
            very low match and you won't be able to apply.
          </GlowCardDescription>
        </GlowCardHeader>
        <GlowCardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job_title">Current or most recent job title *</Label>
              <Input
                id="job_title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. IT Helpdesk Advisor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desired_job_title">Job title you're looking for</Label>
              <Input
                id="desired_job_title"
                value={desiredJobTitle}
                onChange={(e) => setDesiredJobTitle(e.target.value)}
                placeholder="e.g. 1st Line Support Analyst"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years_experience">Years of experience</Label>
              <Input
                id="years_experience"
                type="number"
                min={0}
                max={60}
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_area">Area of work</Label>
              <select
                id="work_area"
                value={workArea}
                onChange={(e) => setWorkArea(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select an area</option>
                {workAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialism</Label>
              <Input
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. IT Support"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="min_salary">Minimum salary (£) *</Label>
              <Input
                id="min_salary"
                type="number"
                min={0}
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="30000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_salary">Maximum salary (£) *</Label>
              <Input
                id="max_salary"
                type="number"
                min={0}
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                placeholder="40000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Where would you like to work? *</Label>
            <p className="text-sm text-muted-foreground">
              Select every area you'd consider. {locations.length} selected.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {LOCATION_OPTIONS.map((option) => {
                const selected = locations.includes(option);
                return (
                  <Badge
                    key={option}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selected}
                    onClick={() => toggleLocation(option)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleLocation(option);
                      }
                    }}
                    variant={selected ? "default" : "outline"}
                    className={cn("cursor-pointer select-none px-3 py-1", selected && "font-semibold")}
                  >
                    {option}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Job Preferences
                </>
              )}
            </Button>
          </div>
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
