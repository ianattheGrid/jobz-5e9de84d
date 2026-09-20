
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useSavedSearches } from "@/hooks/search/useSavedSearches";

export function SavedSearches() {
  const { savedSearches, updateMatchThreshold, toggleSearchActive, setAlertFrequency } = useSavedSearches();

  if (savedSearches.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Saved Searches</h2>
      <div className="grid gap-4">
        {savedSearches.map((search) => (
          <Card key={search.id} className="bg-black/40 backdrop-blur-xl border-primary/30 text-white">
            <CardHeader>
              <CardTitle className="text-base text-white">
                {search.work_area || "All Areas"}
                {search.specialization && ` - ${search.specialization}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {search.required_skills && search.required_skills.length > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">Skills:</span>{" "}
                    {search.required_skills.join(", ")}
                  </p>
                )}
                {(search.min_salary || search.max_salary) && (
                  <p className="text-sm">
                    <span className="font-medium">Salary Range:</span>{" "}
                    {search.min_salary && `£${search.min_salary.toLocaleString()}`}
                    {" - "}
                    {search.max_salary && `£${search.max_salary.toLocaleString()}`}
                  </p>
                )}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Match Threshold: {search.match_threshold}%</p>
                  <Slider
                    value={[search.match_threshold]}
                    onValueChange={([value]) => updateMatchThreshold(search.id, value)}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Receive Notifications</span>
                  <Switch
                    checked={search.is_active}
                    onCheckedChange={(checked) => toggleSearchActive(search.id, checked)}
                  />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Email me new matches daily</p>
                    <p className="text-xs text-white/60">
                      One email each morning with anyone new who fits, and why they fit.
                    </p>
                  </div>
                  <Switch
                    checked={search.alert_frequency === 'daily'}
                    onCheckedChange={(checked) => setAlertFrequency(search.id, checked ? 'daily' : 'off')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
