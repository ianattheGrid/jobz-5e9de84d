import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HOBBY_OPTIONS, CHAR_LIMITS } from "./constants";

interface HobbiesBlockProps {
  selectedTags: string[];
  otherText: string | null;
  workNote: string | null;
  onTagsChange: (tags: string[]) => void;
  onOtherChange: (text: string | null) => void;
  onWorkNoteChange: (text: string | null) => void;
}

export function HobbiesBlock({
  selectedTags,
  otherText,
  workNote,
  onTagsChange,
  onOtherChange,
  onWorkNoteChange,
}: HobbiesBlockProps) {
  const handleToggle = (key: string) => {
    if (selectedTags.includes(key)) {
      onTagsChange(selectedTags.filter(k => k !== key));
    } else {
      onTagsChange([...selectedTags, key]);
    }
  };

  const showOtherInput = selectedTags.includes('other');

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900">Hobbies & Interests</h4>
        <p className="text-sm text-gray-600">
          What do you do outside of work? These can show employers valuable traits
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-3">
        {HOBBY_OPTIONS.map((option) => {
          const isSelected = selectedTags.includes(option.key);
          
          return (
            <label
              key={option.key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-pink-50 border-pink-300' 
                  : 'bg-white border-gray-200 hover:border-pink-200 hover:bg-pink-50/50'
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleToggle(option.key)}
                className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
              />
              <span className={`text-sm ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                {option.label}
              </span>
            </label>
          );
        })}
        
        {/* Other option */}
        <label
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
            showOtherInput 
              ? 'bg-pink-50 border-pink-300' 
              : 'bg-white border-gray-200 hover:border-pink-200 hover:bg-pink-50/50'
          }`}
        >
          <Checkbox
            checked={showOtherInput}
            onCheckedChange={() => {
              if (showOtherInput) {
                onTagsChange(selectedTags.filter(k => k !== 'other'));
                onOtherChange(null);
              } else {
                onTagsChange([...selectedTags, 'other']);
              }
            }}
            className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
          />
          <span className={`text-sm ${showOtherInput ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
            Other
          </span>
        </label>
      </div>
      
      {showOtherInput && (
        <div>
          <Input
            placeholder="What other hobbies do you have?"
            value={otherText || ''}
            onChange={(e) => onOtherChange(e.target.value.slice(0, CHAR_LIMITS.hobby_other))}
            maxLength={CHAR_LIMITS.hobby_other}
            className="text-sm"
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {(otherText || '').length}/{CHAR_LIMITS.hobby_other}
          </p>
        </div>
      )}

      {/* Work connection note */}
      <div className="pt-4 border-t">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Optional: if you want, explain briefly how your hobbies might help you at work
          </span>
          <Textarea
            placeholder="e.g., I run a 5-a-side team and a small gaming server – good for organising and talking to people..."
            value={workNote || ''}
            onChange={(e) => onWorkNoteChange(e.target.value.slice(0, CHAR_LIMITS.hobby_to_work_note))}
            maxLength={CHAR_LIMITS.hobby_to_work_note}
            className="mt-2 text-sm resize-none"
            rows={2}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {(workNote || '').length}/{CHAR_LIMITS.hobby_to_work_note}
          </p>
        </label>
      </div>
    </div>
  );
}
