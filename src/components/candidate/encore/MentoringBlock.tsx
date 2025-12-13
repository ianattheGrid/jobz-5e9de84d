import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Users, ChevronDown, ChevronUp, X, Plus } from "lucide-react";
import { MAX_MENTORING_TOPICS } from "./constants";

interface MentoringBlockProps {
  openToMentoring: boolean;
  mentoringTopics: string[];
  onOpenToMentoringChange: (open: boolean) => void;
  onMentoringTopicsChange: (topics: string[]) => void;
}

export function MentoringBlock({
  openToMentoring,
  mentoringTopics,
  onOpenToMentoringChange,
  onMentoringTopicsChange,
}: MentoringBlockProps) {
  const [isOpen, setIsOpen] = useState(openToMentoring);
  const [inputValue, setInputValue] = useState('');

  const addTopic = () => {
    if (inputValue.trim() && mentoringTopics.length < MAX_MENTORING_TOPICS && !mentoringTopics.includes(inputValue.trim())) {
      onMentoringTopicsChange([...mentoringTopics, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTopic = (topic: string) => {
    onMentoringTopicsChange(mentoringTopics.filter(t => t !== topic));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTopic();
    }
  };

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded-lg -mx-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-600" />
              <div>
                <h4 className="text-lg font-semibold text-foreground">Mentoring & Knowledge-Sharing (Optional)</h4>
                <p className="text-sm text-muted-foreground">Share your experience with others</p>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="pt-4 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div>
              <Label className="text-base font-medium">
                Are you open to mentoring or supporting less experienced staff?
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                This can be a valuable way to share your expertise.
              </p>
            </div>
            <Switch
              checked={openToMentoring}
              onCheckedChange={onOpenToMentoringChange}
            />
          </div>

          {openToMentoring && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <Label className="text-base font-medium">
                What kinds of people or topics could you help with?
              </Label>
              <p className="text-sm text-muted-foreground">
                e.g. "New managers in retail", "Career changers into logistics"
              </p>

              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a topic and press Enter..."
                  disabled={mentoringTopics.length >= MAX_MENTORING_TOPICS}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTopic}
                  disabled={!inputValue.trim() || mentoringTopics.length >= MAX_MENTORING_TOPICS}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {mentoringTopics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {mentoringTopics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-sm"
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="hover:bg-amber-500/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
